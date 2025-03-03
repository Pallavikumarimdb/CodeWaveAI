import {  useState } from "react";
import { FolderTree, ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";
import { FileItem } from "../../types";

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  onUpdateFile: (updatedFile: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
  selectedPath: string | null;
  onUpdateFile: (updatedFile: FileItem) => void;
}

function FileNode({ item, depth, onFileClick, selectedPath, onUpdateFile }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="text-xs font-thin select-none">
      <div
        className={`flex items-center gap-1 p-1 rounded-md cursor-pointer ${
          item.path === selectedPath ? "bg-[#2a2d2e]" : "hover:bg-[#2a2d2e]"
        }`}
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        {item.type === "folder" && (
          <span className="text-gray-400">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {item.type === "folder" ? (
          <Folder size={16} className="mr-1 text-[#e8ab53]" />
        ) : (
          <FileText className="w-4 h-4 text-gray-400" />
        )}
        <span className="text-gray-200">{item.name}</span>
      </div>
      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              selectedPath={selectedPath}
              onUpdateFile={onUpdateFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect, onUpdateFile }: FileExplorerProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  

  // useEffect(() => {
  //   console.log("FileExplorer received files:", files);
  // }, [files]);

  const handleFileClick = (file: FileItem) => {
    setSelectedPath(file.path);
    onFileSelect(file);
  };


  return (
    <div className="rounded-lg shadow-lg p-4 h-full overflow-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-thin mb-4 flex items-center gap-2 text-gray-100">
          <FolderTree className="w-5 h-5 mr-1 text-[#e8ab53]" /> File Explorer
        </h2>
      </div>
      {files.length === 0 ? (
        <div className="text-gray-400 text-xs">No files available</div>
      ) : (
        <div className="space-y-1">
          {files.map((file, index) => (
            <FileNode
              key={`${file.path}-${index}`}
              item={file}
              depth={0}
              onFileClick={handleFileClick}
              selectedPath={selectedPath}
              onUpdateFile={onUpdateFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}