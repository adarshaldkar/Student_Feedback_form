const { exec } = require('child_process');
const path = require('path');

// Start the server with ts-node directly
const serverProcess = exec('npx ts-node src/server.ts', {
  cwd: __dirname,
  env: { ...process.env, NODE_ENV: 'development' }
});

serverProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Keep the process alive
process.stdin.resume();
