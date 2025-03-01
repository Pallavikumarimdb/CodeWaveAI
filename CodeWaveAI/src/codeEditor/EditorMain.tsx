import { useState, useEffect } from 'react';
import Split from 'react-split';
import { Terminal as Code, FileText } from 'lucide-react';
import Terminal from './components/Terminal';
import { FileExplorer } from './components/FileExplorer';
import ActivityBar from './components/ActivityBar';
import StatusBar from './components/StatusBar';
import { FileItem } from '../types';
import { CodeEditor } from './components/CodeEditor';

//@ts-ignore
function EditorMain({ files, selectedFile, onFileSelect, webcontainer }) {
  const [activeFile, setActiveFile] = useState<FileItem | null>(selectedFile);
  const [openFiles, setOpenFiles] = useState<FileItem[]>(selectedFile ? [selectedFile] : []);
  const [sidebarVisible] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('explorer');
  const [terminalVisible, setTerminalVisible] = useState<boolean>(true);

  // Update activeFile when selectedFile changes from parent
  useEffect(() => {
    if (selectedFile && (!activeFile || activeFile.path !== selectedFile.path)) {
      setActiveFile(selectedFile);


      if (!openFiles.some(file => file.path === selectedFile.path)) {
        setOpenFiles(prev => [...prev, selectedFile]);
      }
    }
  }, [selectedFile]);

  const openFile = (file: FileItem) => {
    setActiveFile(file);
    onFileSelect(file); // Pass the FileItem object to the parent

    if (!openFiles.some(f => f.path === file.path)) {
      setOpenFiles(prev => [...prev, file]);
    }
  };

  // const toggleSidebar = () => {
  //   setSidebarVisible(!sidebarVisible);
  // };

  // const handleUpdateFileContent = async (content: string) => {
  //   if (activeFile && activeFile.type === 'file') {
  //     // Create a new file object with updated content
  //     const updatedFile = {
  //       ...activeFile,
  //       content: content
  //     };

  //     setActiveFile(updatedFile);

  //     // Update the file in the open files list
  //     setOpenFiles(prev =>
  //       prev.map(file =>
  //         file.path === activeFile.path ? updatedFile : file
  //       )
  //     );

  //     // Notify parent component
  //     onFileSelect(updatedFile);

  //     // If WebContainer is available, update the file in WebContainer
  //     if (webcontainer) {
  //       try {
  //         // Remove leading slash if exists (WebContainer expects paths without leading slashes)
  //         const filePath = activeFile.path.startsWith('/') ? activeFile.path.substring(1) : activeFile.path;
  //         await webcontainer.fs.writeFile(filePath, content);
  //       } catch (error) {
  //         console.error(`Error writing file ${activeFile.path}:`, error);
  //       }
  //     }
  //   }
  // };


  const closeFile = (filePath: string) => {
    const newOpenFiles = openFiles.filter(file => file.path !== filePath);
    setOpenFiles(newOpenFiles);

    if (activeFile && activeFile.path === filePath) {
      if (newOpenFiles.length > 0) {
        const newActiveFile = newOpenFiles[0];
        setActiveFile(newActiveFile);
        onFileSelect(newActiveFile);
      } else {
        setActiveFile(null);
        onFileSelect(null);
      }
    }
  };



  const getFileName = (path: string) => {
    if (typeof path !== 'string') {
      console.error('Expected path to be a string, but got:', path);
      return '';
    }
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  };


  const toggleTerminal = () => {
    setTerminalVisible(!terminalVisible);
  };



  const findFileByPath = (fileList: FileItem[], path: string): FileItem | null => {
    for (const file of fileList) {
      if (file.path === path) {
        return file;
      }
      if (file.type === 'folder' && file.children) {
        const found = findFileByPath(file.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const getFileLanguage = (filePath: string) => {
    if (!filePath) return 'plaintext';

    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) return 'javascript';
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) return 'javascript';
    if (filePath.endsWith('.json')) return 'json';
    if (filePath.endsWith('.html')) return 'html';
    if (filePath.endsWith('.css')) return 'css';
    if (filePath.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  return (
    <div className="flex flex-col w-full h-full overflow-auto bg-[#1e1e1e] text-white">

      <div className="flex items-center px-4 py-1 bg-[#333333] text-sm">
        <div className="flex space-x-4">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Run</span>
          <span>Terminal</span>
          <span>Help</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {sidebarVisible && (
          <div className="w-44 bg-[#252526] border-r border-[#3c3c3c]">
            {activeTab === 'explorer' && (
              <div className="h-full overflow-auto">
                <FileExplorer
                  files={files}
                  onFileSelect={(file) => {
                    if (file.type === 'file') {
                      openFile(file);
                    }
                  }}
                />
              </div>
            )}
            {activeTab === 'search' && (
              <div className="p-4">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full p-1 bg-[#3c3c3c] border border-[#3c3c3c] rounded text-white"
                  />
                </div>
                <div className="text-[#cccccc]">No results found</div>
              </div>
            )}
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">

          <div className="flex overflow-x-auto bg-[#252526] border-b border-[#3c3c3c]">
            {openFiles.map(file => (
              <div
                key={file.path}
                className={`flex items-center px-3 py-1 text-sm cursor-pointer ${activeFile && activeFile.path === file.path ? 'bg-[#1e1e1e] text-white' : 'bg-[#2d2d2d] text-[#cccccc]'}`}
                onClick={() => openFile(file)}
              >
                <FileText size={14} className="mr-1" />
                <span>{getFileName(file.path)}</span>
                <span
                  className="ml-2 hover:bg-[#3c3c3c] rounded-full p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file.path);
                  }}
                >
                  ×
                </span>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            {activeFile && activeFile.type === 'file' ? (
              <Split direction="vertical" gutterSize={5} className="h-full">
                {[
                  <CodeEditor
                    language={getFileLanguage(activeFile.path)}
                    file={activeFile} />,
                  terminalVisible && <Terminal webContainer={webcontainer} key="terminal" />
                ]}
              </Split>
            ) : (
              <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-[#cccccc]">
                <div className="text-center">
                  <Code size={48} className="mx-auto mb-4 text-[#cccccc]" />
                  <h2 className="text-2xl font-light mb-2">VS Code Browser Edition</h2>
                  <p className="text-sm">Open a file from the explorer to start editing</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <StatusBar toggleTerminal={toggleTerminal} webContainerReady={!!webcontainer} />
    </div>
  );
}

export default EditorMain;
