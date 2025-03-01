import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer;

export async function getWebContainerInstance() {
  if (!webcontainerInstance) {
    try {
      webcontainerInstance = await WebContainer.boot();
      
      await webcontainerInstance.mount({
        'index.js': {
          file: {
            contents: `
console.log('Hello from WebContainer!');
console.log('You can now run Node.js code directly in the browser.');
`,
          },
        },
        'package.json': {
          file: {
            contents: `
{
  "name": "webcontainer-project",
  "version": "1.0.0",
  "description": "Project running in WebContainer",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}`,
          },
        },
      });
      
      console.log('WebContainer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error);
      throw error;
    }
  }
  
  return webcontainerInstance;
}

export async function writeFile(path: string, contents: string) {
  const container = await getWebContainerInstance();
  await container.fs.writeFile(path, contents);
}

export async function readFile(path: string) {
  const container = await getWebContainerInstance();
  const file = await container.fs.readFile(path, 'utf-8');
  return file;
}

export async function listFiles(path: string = '/') {
  const container = await getWebContainerInstance();
  const entries = await container.fs.readdir(path, { withFileTypes: true });
  return entries;
}

export async function createDirectory(path: string) {
  const container = await getWebContainerInstance();
  await container.fs.mkdir(path, { recursive: true });
}

export async function runCommand(command: string, args: string[] = []) {
  const container = await getWebContainerInstance();
  return container.spawn(command, args);
}

export async function runCommandWithTerminal(
  command: string, 
  args: string[] = [], 
  onOutput: (data: string) => void,
  onError: (data: string) => void
) {
  const container = await getWebContainerInstance();
  const process = await container.spawn(command, args);
  
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        onOutput(data);
      }
    })
  );
  
  if (process.stderr) {
    process.stderr.pipeTo(
      new WritableStream({
        write(data) {
          onError(data);
        }
      })
    );
  }
  
  return process;
}