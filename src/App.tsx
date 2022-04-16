import { CommunicationIdentityClient } from "@azure/communication-identity";

import React, { useState } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { AdminUserPanel } from './components/AdminUserPanel';
import { MainChatThreadPanel } from './components/MainChatThreadPanel';

const App = () => {
  const [connectionString, setConnectionString] = useState('');
  const [identityClient, setIdentityClient] = useState<CommunicationIdentityClient>();

  const onConnectionStringChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      const connStr = newValue;
      setConnectionString(connStr);

      const client = new CommunicationIdentityClient(connStr);
      setIdentityClient(client);
    }
  }

  return (
    <>
      <TextField
        styles={{ root: { width: 650 }}}
        label="Connection String"
        value={connectionString}
        onChange={onConnectionStringChange}
        type="password"
        canRevealPassword
      />
      <AdminUserPanel identityClient={identityClient}/>
      <MainChatThreadPanel />
    </>
  );
}

export default App;
