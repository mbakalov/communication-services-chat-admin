import { useState } from 'react';
import {
  Checkbox,
  DefaultButton,
  Stack,
  Text,
  mergeStyles
} from '@fluentui/react';

import MonacoEditor from 'react-monaco-editor';

export const TestDataPanel = () => {
  const [isUploadInProgress, setIsUploadInProgress] = useState<boolean>(false);

  const onUploadClicked = () => {
    const doUpload = async () => {
      console.log('doUpload is happening');
      setIsUploadInProgress(true);

      setTimeout(() => {
        console.log('do upload done');
        setIsUploadInProgress(false);
      }, 1000);
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
            language='json'
            height='600px'
            options={{
              minimap: {enabled: false}
            }}
            className={editorStyles}
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
          />
        </div>
      </div>
    </Stack>
  );
}