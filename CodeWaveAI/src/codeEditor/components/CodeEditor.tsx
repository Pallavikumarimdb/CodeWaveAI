import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { FileItem } from "../../types";
import { FaSave, FaExclamationTriangle, } from "react-icons/fa";

interface CodeEditorProps {
  file: FileItem | null;
  language: string;
  onFileChange: (updatedFile: FileItem) => void;
}

export function CodeEditor({ file, language, onFileChange }: CodeEditorProps) {
  const [editorValue, setEditorValue] = useState(file?.content || "");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setEditorValue(file?.content || "");
    setIsDirty(false);
  }, [file]);

  function handleEditorChange(value: string | undefined) {
    if (value !== undefined && file) {
      setEditorValue(value);
      setIsDirty(true);
    }
  }

  async function saveFile() {
    if (file) {
      try {
        
        const updatedFile = { ...file, content: editorValue };
        onFileChange(updatedFile);
        setIsDirty(false);
        setTimeout(() => {
        }, 2000);
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }
  }

  if (!file) {
    return <div className="h-full flex items-center justify-center text-gray-400">Select a file to view its contents</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <Editor
        height="90%"
        language={language}
        theme="vs-dark"
        value={editorValue}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
        }}
      />
     {isDirty &&  ( <div className="flex justify-between items-center p-1 bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400 font-mono">
          {file.path}
        </span>
          <span className="text-yellow-500 text-sm flex items-center">
            <FaExclamationTriangle className="mr-1" />
            (unsaved changes)
          </span>
      </div>

      <button
      onClick={saveFile}
      className={`flex items-center px-2 py-1 text-sm font-medium rounded-md transition-all ${
        isDirty
          ? "bg-gray-600 hover:bg-blue-700"
          : "bg-gray-600 cursor-not-allowed"
      }`}
      disabled={!isDirty}
    >
      <FaSave className="mr-2" />
      Save
    </button>
    </div>
    )}
    </div>
  );
}