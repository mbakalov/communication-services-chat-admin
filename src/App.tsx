import { parseConnectionString } from '@azure/communication-common';
import { CommunicationIdentityClient } from "@azure/communication-identity";

import React, { useState } from 'react';
import { TextField, Pivot, PivotItem } from '@fluentui/react';
import { Header } from './components/Header';
import { AdminUserPanel } from './components/AdminUserPanel';
import { MainChatThreadPanel } from './components/MainChatThreadPanel';
import { TestDataPanel } from './components/TestDataPanel';

const App = () => {
  const [connectionString, setConnectionString] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [identityClient, setIdentityClient] = useState<CommunicationIdentityClient>();
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  const onConnectionStringChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      const connStr = newValue;
      const endpointCredential = parseConnectionString(connStr);

      setConnectionString(connStr);
      setEndpointUrl(endpointCredential.endpoint);

      const client = new CommunicationIdentityClient(connStr);
      setIdentityClient(client);
    }
  }

  const onGenerateClicked = async () => {
    if (identityClient) {
      // If we have been given an existing user - generate a token for them
      if (userId !== '') {
        const token = await identityClient.getToken({ communicationUserId: userId }, ["chat"]);
        console.log('user', userId);
        console.log('token', token.token);
        setToken(token.token);
      } else { // Otherwise - create both user and token
        const { user, token } = await identityClient.createUserAndToken(["chat"]);
        console.log('user', user.communicationUserId);
        console.log('token', token);
        setUserId(user.communicationUserId);
        setToken(token);
      }
    }
  }

  const onUserIdChanged = (newUserId?: string) => {
    setUserId(newUserId ?? '');
    setToken('');
  }

  return (
    <>
      <Header />
      <TextField
        styles={{ root: { width: 650 }}}
        label="Connection String"
        value={connectionString}
        onChange={onConnectionStringChange}
        type="password"
        canRevealPassword
      />
      <AdminUserPanel
        userId={userId}
        token={token}
        onGenerateClicked={onGenerateClicked}
        onUserIdChanged={onUserIdChanged} />
      <Pivot>
        <PivotItem headerText='Browse Threads'>
          <MainChatThreadPanel
            key={userId}
            endpointUrl={endpointUrl}
            token={token}
            userId={userId}
          />
        </PivotItem>
        <PivotItem headerText='Create Test Data'>
          {identityClient && <TestDataPanel
            endpointUrl={endpointUrl}
            adminToken={token}
            identityClient={identityClient}
          />}
        </PivotItem>
      </Pivot>
      
    </>
  );
}

export default App;
