import React from 'react';
import { FileText, Search, GitBranch, Bug, Utensils as Extension, Settings } from 'lucide-react';

interface ActivityBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'explorer', icon: FileText, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'git', icon: GitBranch, label: 'Source Control' },
    { id: 'debug', icon: Bug, label: 'Run and Debug' },
    { id: 'extensions', icon: Extension, label: 'Extensions' },
  ];

  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center py-2">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`p-2 mb-2 cursor-pointer relative ${
            activeTab === tab.id ? 'text-white' : 'text-[#858585] hover:text-white'
          }`}
          onClick={() => setActiveTab(tab.id)}
          title={tab.label}
        >
          {activeTab === tab.id && (
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>
          )}
          <tab.icon size={24} />
        </div>
      ))}
      <div className="flex-1"></div>
      <div className="p-2 cursor-pointer text-[#858585] hover:text-white" title="Settings">
        <Settings size={24} />
      </div>
    </div>
  );
};

export default ActivityBar;