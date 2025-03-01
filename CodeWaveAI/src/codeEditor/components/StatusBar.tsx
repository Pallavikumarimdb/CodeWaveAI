import React from 'react';
import { GitBranch, Bell, Check, Terminal } from 'lucide-react';

interface StatusBarProps {
  toggleTerminal: () => void;
  webContainerReady?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ toggleTerminal, webContainerReady = false }) => {
  return (
    <div className="flex items-center justify-between px-2 py-0.5 bg-[#007acc] text-white text-xs">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <GitBranch size={14} className="mr-1" />
          <span>main</span>
        </div>
        <div className="flex items-center">
          <Check size={14} className="mr-1" />
          <span>0 Problems</span>
        </div>
        {webContainerReady && (
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>
            <span>WebContainer</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="cursor-pointer flex items-center" onClick={toggleTerminal}>
          <Terminal size={14} className="mr-1" />
          <span>Terminal</span>
        </div>
        <div>UTF-8</div>
        <div>JavaScript</div>
        <div>Spaces: 2</div>
        <div>LF</div>
        <div className="cursor-pointer">
          <Bell size={14} />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;