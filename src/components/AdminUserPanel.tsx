import { CommunicationIdentityClient } from "@azure/communication-identity";

import React, { useState } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack } from '@fluentui/react/lib/Stack';
import { PrimaryButton } from '@fluentui/react/lib/Button';

export interface AdminUserPanelProps {
  identityClient: CommunicationIdentityClient | undefined
}

export const AdminUserPanel = (props: AdminUserPanelProps) => {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  const onGenerateClicked = async () => {
    const client = props.identityClient;
    if (client) {
      const { user, token } = await client.createUserAndToken(["chat"]);
      setUserId(user.communicationUserId);
      setToken(token);
    }
  }

  const onUserIdChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      setUserId(newValue);
      setToken('');
    }
  }

  return (
    <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: 650 }}}>
      <TextField
        label="User Id"
        placeholder="Paste existing User Id or press 'Generate'"
        value={userId}
        onChange={onUserIdChange}
        />
      <TextField
        label="Access Token"
        value={token}
        />
      <PrimaryButton text="Generate" style={{width: '100px'}} onClick={onGenerateClicked} />
    </Stack>
  );
}
