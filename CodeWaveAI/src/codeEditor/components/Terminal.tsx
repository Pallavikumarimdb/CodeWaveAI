import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import 'xterm/css/xterm.css';
import { runCommandWithTerminal } from './webcontainer';
import { WebContainer } from '@webcontainer/api';

interface TerminalProps {
  webContainer: WebContainer;
}

const Terminal: React.FC<TerminalProps> = ({ webContainer }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isWebContainerReady, setIsWebContainerReady] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDirectory, setCurrentDirectory] = useState('/');

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js
    xtermRef.current = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#cccccc',
        cursor: '#ffffff',
        //@ts-ignore
        selection: 'rgba(255, 255, 255, 0.3)',
      },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.2,
    });

    // Initialize fit addon
    fitAddonRef.current = new FitAddon();
    xtermRef.current.loadAddon(fitAddonRef.current);
    
    // Add web links addon
    xtermRef.current.loadAddon(new WebLinksAddon());

    // Open terminal
    xtermRef.current.open(terminalRef.current);
    fitAddonRef.current.fit();

    // Welcome message
    xtermRef.current.writeln('\x1b[1;34mWelcome to VS Code Browser Edition Terminal\x1b[0m');
    xtermRef.current.writeln('Initializing WebContainer...');

    // Initialize WebContainer
    initializeWebContainer();

    // Handle user input
    xtermRef.current.onData(handleTerminalInput);

    // Handle window resize
    const handleResize = () => {
      fitAddonRef.current?.fit();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      xtermRef.current?.dispose();
    };
  }, [webContainer]);

  const initializeWebContainer = async () => {
    try {
      setIsWebContainerReady(true);
      
      if (xtermRef.current) {
        xtermRef.current.writeln('\x1b[1;32mWebContainer initialized successfully!\x1b[0m');
        xtermRef.current.writeln('You can now run commands like: ls, node, npm, etc.');
        xtermRef.current.writeln('');
        writePrompt();
      }
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error);
      if (xtermRef.current) {
        xtermRef.current.writeln('\x1b[1;31mFailed to initialize WebContainer\x1b[0m');
        xtermRef.current.writeln('This browser may not support WebContainer or it may be disabled.');
        xtermRef.current.writeln('');
        writePrompt();
      }
    }
  };

  const writePrompt = () => {
    if (xtermRef.current) {
      xtermRef.current.write(`\x1b[1;36m${currentDirectory}\x1b[0m $ `);
    }
  };

  const handleTerminalInput = (data: string) => {
    if (!xtermRef.current) return;

    // Handle special keys
    if (data === '\r') { // Enter key
      xtermRef.current.writeln('');
      if (currentCommand.trim()) {
        executeCommand(currentCommand.trim());
        setCommandHistory(prev => [currentCommand.trim(), ...prev.slice(0, 49)]);
        setHistoryIndex(-1);
      } else {
        writePrompt();
      }
      setCurrentCommand('');
      return;
    }

    if (data === '\u007f') { // Backspace
      if (currentCommand.length > 0) {
        setCurrentCommand(prev => prev.slice(0, -1));
        xtermRef.current?.write('\b \b');
      }
      return;
    }

    if (data === '\u001b[A') { // Up arrow
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        const historyCommand = commandHistory[newIndex];
        
        // Clear current command
        while (currentCommand.length > 0) {
          xtermRef.current.write('\b \b');
          setCurrentCommand(prev => prev.slice(0, -1));
        }
        
        // Write history command
        xtermRef.current.write(historyCommand);
        setCurrentCommand(historyCommand);
      }
      return;
    }

    if (data === '\u001b[B') { // Down arrow
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const historyCommand = commandHistory[newIndex];
        
        // Clear current command
        while (currentCommand.length > 0) {
          xtermRef.current.write('\b \b');
          setCurrentCommand(prev => prev.slice(0, -1));
        }
        
        // Write history command
        xtermRef.current.write(historyCommand);
        setCurrentCommand(historyCommand);
      } else if (historyIndex === 0) {
        // Clear current command
        while (currentCommand.length > 0) {
          xtermRef.current.write('\b \b');
          setCurrentCommand(prev => prev.slice(0, -1));
        }
        setHistoryIndex(-1);
      }
      return;
    }

    // Regular character input
    xtermRef.current.write(data);
    setCurrentCommand(prev => prev + data);
  };

  const executeCommand = async (command: string) => {
    if (!isWebContainerReady || !xtermRef.current) {
      xtermRef.current?.writeln('\x1b[1;31mWebContainer is not ready\x1b[0m');
      writePrompt();
      return;
    }

    // Handle built-in commands
    if (command === 'clear' || command === 'cls') {
      xtermRef.current.clear();
      writePrompt();
      return;
    }

    // Parse command and arguments
    const parts = command.split(' ');
    const mainCommand = parts[0];
    const args = parts.slice(1);

    try {
      // Execute command in WebContainer
      await runCommandWithTerminal(
        mainCommand,
        args,
        (data: string) => {
          if (xtermRef.current) {
            xtermRef.current.write(data);
          }
        },
        (data: string) => {
          if (xtermRef.current) {
            xtermRef.current.write(`\x1b[1;31m${data}\x1b[0m`);
          }
        }
      );
      
      // Update current directory if it was a cd command
      if (mainCommand === 'cd' && args.length > 0) {
        // This is a simplified approach - in a real implementation,
        // you would need to resolve the path properly
        if (args[0].startsWith('/')) {
          setCurrentDirectory(args[0]);
        } else if (args[0] === '..') {
          const parts = currentDirectory.split('/').filter(Boolean);
          if (parts.length > 0) {
            parts.pop();
          }
          setCurrentDirectory('/' + parts.join('/'));
        } else {
          setCurrentDirectory(currentDirectory === '/' 
            ? `/${args[0]}` 
            : `${currentDirectory}/${args[0]}`);
        }
      }
    } catch (error) {
      console.error('Command execution error:', error);
      xtermRef.current.writeln(`\x1b[1;31mError: ${error instanceof Error ? error.message : String(error)}\x1b[0m`);
    }
    
    writePrompt();
  };

  return (
    <div className="h-full bg-[#1e1e1e] border-t border-[#3c3c3c] overflow-hidden">
      <div className="flex items-center px-4 py-1 bg-[#252526] text-sm border-b border-[#3c3c3c]">
        <span className="text-white">Terminal</span>
        <span className="ml-2 px-2 py-0.5 text-xs bg-[#3c3c3c] rounded-full">
          {isWebContainerReady ? 'WebContainer: Ready' : 'WebContainer: Initializing...'}
        </span>
      </div>
      <div ref={terminalRef} className="h-[calc(100%-28px)]" />
    </div>
  );
};

export default Terminal;