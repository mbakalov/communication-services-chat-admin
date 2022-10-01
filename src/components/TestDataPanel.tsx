import {
  Checkbox,
  DefaultButton,
  Stack,
  mergeStyles
} from '@fluentui/react';

import MonacoEditor from 'react-monaco-editor';

export const TestDataPanel = () => {

  const editorStyles = mergeStyles({
    float: 'left',
    width: '50%'
  });
  
  const resultsStyles = editorStyles;

  return (
    <Stack tokens={{childrenGap: 10, padding: 10}}>
      <Stack horizontal tokens={{childrenGap: 10}}>
        <DefaultButton text='Upload' />
        <Stack.Item align='center'>
          <Checkbox label='Add current user to all threads' disabled defaultChecked />
        </Stack.Item>
      </Stack>
      <div>
        <div className={editorStyles}>
          <MonacoEditor
            language='json'
          />
        </div>
        <div className={resultsStyles}>RESULTS</div>
      </div>
    </Stack>
  );
}