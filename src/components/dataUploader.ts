import { ChatClient, ChatThreadClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
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

export const upload = async (
  identityClient: CommunicationIdentityClient,
  endpoint: string,
  token: string,
  data: UploadRequest
) => {

  const userMap = new Map<string, { 
    id: string,
    acsId: string,
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
      acsId: res.user.communicationUserId,
      acsToken: res.token,
      displayName: u.name,
      chatClient: chatClient
    });
  }

  const adminChatClient = new ChatClient(endpoint, new AzureCommunicationTokenCredential(token));

  for (const t of data.chatThreads) {
    // create a thread
    const thread = await adminChatClient.createChatThread({ topic: t.topic }, {
      participants: t.participants.map(p => { 
        const u = userMap.get(p) ?? { acsId: '', displayName: 'unknown' };
        return {
          id: {
            communicationUserId: u.acsId
          },
          displayName: u.displayName
        }
      })
    });

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
        const senderChatThreadClient = userMap.get(m.sender)?.chatThreadClient;
        if (senderChatThreadClient) {
          senderChatThreadClient.sendMessage({ content: m.content });
        }
      }
    }
  }
}