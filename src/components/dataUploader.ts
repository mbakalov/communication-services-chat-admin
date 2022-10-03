import { ChatClient, ChatThreadClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from "@azure/communication-common";
import { CommunicationIdentityClient } from "@azure/communication-identity";

export interface User {
  id: string,
  name: string
}

export interface ChatThread {
  topic: string,
  participants: string[],
  messages: ChatThreadMessage[]
}

export interface ChatThreadMessage {
  sender: string,
  content: string
}

export interface UploadRequest {
  users: User[],
  chatThreads: ChatThread[]
}

export interface ResponseUser {
  id: string,
  acsId: string,
  token: string
}

export interface ResponseThread {
  topic: string,
  threadId: string
}

export interface UploadResponse {
  users: ResponseUser[],
  threads: ResponseThread[]
}

// prevent getting throttled by identity and/or chat APIs
const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => { resolve() }, ms);
  })
}

export const upload = async (
  identityClient: CommunicationIdentityClient,
  endpoint: string,
  token: string,
  data: UploadRequest
): Promise<UploadResponse> => {

  const response = { users: [] as ResponseUser[], threads: [] as ResponseThread[] };

  const userMap = new Map<string, { 
    id: string,
    acsUser: CommunicationUserIdentifier,
    acsToken: string,
    displayName: string,
    chatClient: ChatClient,
    chatThreadClient?: ChatThreadClient
  }>();

  for (const u of data.users) {
    const res = await identityClient.createUserAndToken(['chat']);
    const chatClient = new ChatClient(endpoint, new AzureCommunicationTokenCredential(res.token));
    userMap.set(u.id, {
      id: u.id,
      acsUser: res.user,
      acsToken: res.token,
      displayName: u.name,
      chatClient: chatClient
    });

    response.users.push({ id: u.id, acsId: res.user.communicationUserId, token: res.token })

    await wait(1000);
  }

  const adminChatClient = new ChatClient(endpoint, new AzureCommunicationTokenCredential(token));

  for (const t of data.chatThreads) {
    // create a thread
    const thread = await adminChatClient.createChatThread({ topic: t.topic }, {
      participants: t.participants.map(p => { 
        const u = userMap.get(p);
        return {
          id: u!.acsUser,
          displayName: u!.displayName
        }
      })
    });

    await wait(1000);

    if (thread.chatThread) {
      // initialize chat thread client for every participant
      for (const p of t.participants) {
        const user = userMap.get(p);
        if (user) {
          user.chatThreadClient = user.chatClient.getChatThreadClient(thread.chatThread.id);
        }
      }

      // send messages on behalf of each participant
      for (const m of t.messages) {
        await wait(1000);

        const senderChatThreadClient = userMap.get(m.sender)?.chatThreadClient;
        if (senderChatThreadClient) {
          senderChatThreadClient.sendMessage({ content: m.content });
        }
      }

      response.threads.push({ topic: t.topic, threadId: thread.chatThread.id });
    }
  }

  return response;
}