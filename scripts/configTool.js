// Script brought to you by Code Busters - https://www.codebusters.ca/

const { writeFile } = require('fs');
const { exec } = require('child_process');

exec('firebase apps:sdkconfig -j', (error, stdout, stderr) => {
  if (stderr) console.error(stderr);

  const data = JSON.parse(stdout);

  let envCopy = '';

  Object.entries(data.result.sdkConfig).forEach(([key, value]) => {
    // replace camelCase
    const varName = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();

    // write a templated string literal to write the line to the file
    envCopy += `FIREBASE_${varName}='${value}'\n`;
  });

  writeFile('./.env', envCopy, (err) => {
    if (err) {
      console.error('Failed to save environment variables: ', err);
    } else {
      console.log('Finished saving environment variables.');
    }
  });
});
