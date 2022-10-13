import { useRef, useState } from 'react';
import {
  Checkbox,
  DefaultButton,
  Stack,
  Text,
  mergeStyles
} from '@fluentui/react';

import MonacoEditor from 'react-monaco-editor';

import { CommunicationIdentityClient } from '@azure/communication-identity';

import { upload, UploadRequest } from './dataUploader';
export interface TestDataPanelProps {
  endpointUrl: string,
  adminToken: string,
  identityClient: CommunicationIdentityClient
}

const sampleData = require('../data/lotr.json');

export const TestDataPanel = (props: TestDataPanelProps) => {
  const [isUploadInProgress, setIsUploadInProgress] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState('');

  const initialSampleData = JSON.stringify(sampleData, null, 2);

  const editorRef = useRef<MonacoEditor>(null);

  const onUploadClicked = () => {
    const doUpload = async () => {
      if (editorRef.current?.editor) {
        const model = editorRef.current?.editor.getModel();
        const value = model?.getValue();
        
        if (value) {
          const valueJson = JSON.parse(value) as UploadRequest;

          setIsUploadInProgress(true);
          setUploadResult('');

          const uploadResult = await upload(
            props.identityClient,
            props.endpointUrl,
            props.adminToken,
            valueJson
          );
        
          const uploadString = JSON.stringify(uploadResult, null, 2);
          setUploadResult(uploadString);
          setIsUploadInProgress(false);
        }
      }
    }

    doUpload();
  }

  const inputPanelStyles = mergeStyles({
    float: 'left',
    width: '50%'
  });
  
  const resultsPanelStyles = mergeStyles({
    float: 'right',
    width: '49%'
  });

  const editorStyles = mergeStyles({
    border: '1px solid darkgray'
  });

  return (
    <Stack tokens={{childrenGap: 10, padding: 10}}>
      <Stack horizontal tokens={{childrenGap: 10}}>
        <DefaultButton
          text='Upload'
          iconProps={isUploadInProgress ? { iconName: 'Refresh'} : undefined}
          onClick={onUploadClicked}
          disabled={isUploadInProgress}
        />
        <Stack.Item align='center'>
          <Checkbox label='Add current user to all threads' disabled defaultChecked />
        </Stack.Item>
      </Stack>
      <div>
        <div className={inputPanelStyles}>
          <Text variant='mediumPlus'>Input data</Text>
          <MonacoEditor
            ref={editorRef}
            language='json'
            height='600px'
            options={{
              minimap: {enabled: false}
            }}
            className={editorStyles}
            defaultValue={initialSampleData}
          />
        </div>
        <div className={resultsPanelStyles}>
          <Text variant='mediumPlus'>Upload results</Text>
          <MonacoEditor
              language='json'
              height='600px'
              options={{
                minimap: {enabled: false}
              }}
              className={editorStyles}
              value={uploadResult}
          />
        </div>
      </div>
    </Stack>
  );
}