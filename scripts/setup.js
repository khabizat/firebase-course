const cp = require('child_process');
const path = require('path');
const readline = require('readline');

const mainPath = path.resolve(__dirname, '../');

const logWithFormat = (string) => {
  console.log('\x1b[34m%s\x1b[0m', `\n${string}\n`);
};

const runCmd = (cmd, params, cwd = null) => {
  const { status } = cp.spawnSync(cmd, params, {
    stdio: 'inherit',
    shell: true,
    cwd,
  });
  if (status !== 0) process.exit(status);
};

const escapeSpecialChars = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getUserInput = (prompt) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(prompt, (userInput) => {
      rl.close();
      const sanitizedInput = escapeSpecialChars(userInput);
      resolve(sanitizedInput);
    })
  );
};

const getKeypress = () => {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve) =>
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};

(async () => {
  logWithFormat(
    "To use React and Firebase Starter, you'll need access to a Firebase project.\nIf you haven't created a project yet, go to https://console.firebase.google.com, click 'Add project'\nand follow the on-screen instructions to create one. Then, enable Firestore Database and Authentication via Google.\nWhen you're ready, press any key to continue. "
  );

  await getKeypress();

  logWithFormat('Installing main dependencies...');
  runCmd('npm', ['ci'], mainPath);
  logWithFormat('Dependencies installed!');
  logWithFormat('Firebase login...');
  runCmd('firebase', ['login']);
  logWithFormat('Getting your Firebase projects...');
  runCmd('firebase', ['projects:list']);

  const projectId = await getUserInput(
    'Enter the Project ID of the project you want to use: '
  );

  runCmd('firebase', ['use', projectId]);
  logWithFormat('Saving your project config to a local .env file...');
  runCmd('node', ['scripts/configTool.js']);
  logWithFormat(
    "You are about to initialize a local Firebase directory.\nThis project is set up to use Firestore, Functions, and Emulators. Make sure you choose these options when prompted by Firebase CLI.\nTo take advantage of this Starter's features, choose not to overwrite existing files when asked by the CLI.\nPress any key to continue. "
  );

  await getKeypress();

  logWithFormat('Initializing Firebase directory for your project...');
  runCmd('firebase', ['init']);

  process.exit();
})();
