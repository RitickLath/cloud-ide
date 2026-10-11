import React, { useState } from 'react';
import { FileIcon, ChevronDown, ChevronRight } from '../atom/FileIcon';
import useEditorStore from '@/store/useEditorStore';
import { useSocket } from '@/store/useSocket';

const FileTreeNode = ({ 
  item, 
  depth = 0, 
  expandedPaths, 
  togglePath 
}: any) => {

  const isFolder = Array.isArray(item?.children);
  const isExpanded = !!expandedPaths[item.path];
  const {socket} = useSocket()
  const {openFile} = useEditorStore();

  const handleOpenFile = (path: string, fileName: string) => {
    const extension = fileName.split('.').pop() || '';

    // First open tab immediately with empty or existing content
    openFile({
      path,
      fileName,
      extension,
      content: '',
    });

    // Request file content via socket if connected
    socket?.emit(
      'file-change',
      { action: 'read', filePath: path },
      (res: any) => {
        if (res?.content !== undefined) {
          useEditorStore.getState().updateFileContent(path, res.content);
        }
      }
    );
  };

  const handleRowClick = () => {
    if (isFolder) {
      togglePath(item.path);
    } else {
      handleOpenFile(item.path, item.name);
    }
  };

  return (
    <div className="select-none flex flex-col font-mono text-sm text-inherit">
      <div 
        className="flex items-center hover:bg-white/10 cursor-pointer py-1 pr-2 transition-colors"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleRowClick}
      >
        {/* Chevron Icon Container */}
        <div className="w-4 h-4 flex items-center justify-center mr-1 text-gray-500">
          {isFolder && (isExpanded ? <ChevronDown /> : <ChevronRight />)}
        </div>
        
        {/* File/Folder Icon Container */}
        <div className="w-4 h-4 flex items-center justify-center mr-2">
          <FileIcon name={item.name} isFolder={isFolder} />
        </div>
        
        {/* File/Folder Name */}
        <span className="truncate">{item.name}</span>
      </div>
      
      {/* Recursive Children Render */}
      {isFolder && isExpanded && (
        <div className="flex flex-col">
          {item.children.map((child: any) => (
            <FileTreeNode 
              key={child.path} 
              item={child} 
              depth={depth + 1}
              expandedPaths={expandedPaths}
              togglePath={togglePath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Node = ({ list, isVisible }: any) => {
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({});

  const togglePath = (path: string) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  if (!isVisible || !list) return null;

  return (
    <div className="w-full h-full bg-transparent overflow-y-auto overflow-x-hidden pt-2 pb-4">
      <div className="flex flex-col">
        {list.children?.map((item: any) => (
          <FileTreeNode 
            key={item.path} 
            item={item} 
            depth={0}
            expandedPaths={expandedPaths}
            togglePath={togglePath}
          />
        ))}
      </div>
    </div>
  );
};

export default Node;