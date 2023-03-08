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
    'To use Next and Firebase Starter, you will need access to a Firebase project.'
  );

  const hasFirebaseProject = await getUserInput(
    'Do you have an existing Firebase Project set up in the Firebase Console? (Y/N)'
  );

  if (hasFirebaseProject.toLowerCase() === 'n') {
    logWithFormat(
      "Let's get you set up with a new project. Follow these steps:"
    );
    logWithFormat(
      '(1/5) Head to https://console.firebase.google.com\nPress any key to go to the next step'
    );
    await getKeypress();

    logWithFormat(
      '(2/5) Add a new project\nPress any key to go to the next step'
    );
    await getKeypress();

    logWithFormat(
      '(3/5) Enable Authentication\nPress any key to go to the next step'
    );
    await getKeypress();

    logWithFormat(
      '(4/5) Enable Firestore Database\nPress any key to go to the next step'
    );
    await getKeypress();

    logWithFormat(
      '(5/5)Register a new web app by going to Project Settings --> Add App\nWhen you are done, press any key to continue.'
    );
    await getKeypress();
  }

  logWithFormat(
    'Now sit back and relax while we install the dependencies for you🍹'
  );
  logWithFormat('(1/1) Installing main dependencies...');
  runCmd('npm', ['ci'], mainPath);
  logWithFormat('Dependencies installed!');
  logWithFormat('Firebase login...');
  runCmd('firebase', ['login']);
  logWithFormat('Getting your Firebase projects...');
  runCmd('firebase', ['projects:list']);

  const projectId = await getUserInput(
    'Enter the Project ID of the Firebase project you want to use: '
  );

  runCmd('firebase', ['use', projectId]);
  logWithFormat('Saving your project config to a local .env file...');
  runCmd('node', ['scripts/configTool.js']);
  logWithFormat('You are about to initialize a local Firebase directory.');
  logWithFormat(
    "☝️ This project is set up to use Firestore and Emulators. Make sure you choose these options when prompted by Firebase CLI.\n⚠️ To take advantage of this Starter's features, choose not to overwrite existing files when asked by the CLI."
  );
  logWithFormat('Press any key to continue.');

  await getKeypress();

  logWithFormat('Initializing Firebase directory for your project...');
  runCmd('firebase', ['init']);

  logWithFormat(
    'Setup complete🎉\nTo start local development:\n- Start Firebase emulators with: npm run emulators\n- In another terminal, start the app with: npm run dev\nHappy coding!'
  );
  process.exit();
})();
