import Editor from '@monaco-editor/react';
import { FileItem } from '../../types';


interface CodeEditorProps {
  file: FileItem | null;
  language: string;
}

export function CodeEditor({ file, language }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a file to view its contents
      </div>
    );
  }

  console.log("Language: " + language);

  return (
    <Editor
      height="100%"
      language={language}
      theme="vs-dark"
      value={file.content || ''}
      options={{
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
        renderLineHighlight: 'all',
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      }}
    />
  );
}