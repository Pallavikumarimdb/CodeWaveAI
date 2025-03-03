import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="border border-slate-700 p-1 w-[200px] text-sm rounded-3xl pl-1 bg-[#3b3b3b] ml-4 flex space-x-2 mb-3">
      <button
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-2 px-2 py-1 rounded-3xl transition-colors ${
          activeTab === 'code'
            ? 'bg-[#0d1a23] text-gray-100'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
        }`}
      >
        <Code2 className="w-4 h-4" />
        Code
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={`flex items-center gap-2 px-2 py-1 rounded-3xl transition-colors ${
          activeTab === 'preview'
            ? 'bg-[#0d1a23] text-gray-100'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
        }`}
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
    </div>
  );
}