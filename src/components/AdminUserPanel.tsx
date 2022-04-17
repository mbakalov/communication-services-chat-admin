import React from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack } from '@fluentui/react/lib/Stack';
import { PrimaryButton } from '@fluentui/react/lib/Button';

export interface AdminUserPanelProps {
  userId: string,
  token: string,
  onGenerateClicked: () => Promise<void>,
  onUserIdChanged: (newUserId: string) => void;
}

export const AdminUserPanel = (props: AdminUserPanelProps) => {

  const onUserIdChanged = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      props.onUserIdChanged(newValue);
    }
  }

  return (
    <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: 650 }}}>
      <TextField
        label="User Id"
        placeholder="Paste existing User Id or press 'Generate'"
        value={props.userId}
        onChange={onUserIdChanged}
        />
      <TextField
        label="Access Token"
        value={props.token}
        readOnly
        />
      <PrimaryButton text="Generate" style={{width: '100px'}} onClick={props.onGenerateClicked} />
    </Stack>
  );
}
