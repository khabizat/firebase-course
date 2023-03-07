const assert = require('assert');
const firebase = require('@firebase/testing');
const fs = require('fs');

const MY_PROJECT_ID = 'emulator-rules';
const myId = 'user_abc';
const theirId = 'user_xyz';
const myAuth = { uid: myId, email: 'abc@gmail.com' };

// Enforce firestore rules hot update in emulators
before(async () => {
  await firebase.loadFirestoreRules({
    projectId: MY_PROJECT_ID,
    rules: fs.readFileSync('./firestore.rules', 'utf8'),
  });
});

function getFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: MY_PROJECT_ID, auth })
    .firestore();
}

function getAdminFirestore() {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
}

// Clear firestore before each test
beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});

describe('Setup', () => {
  it('Understands basic addition, sanity check mocha working', () => {
    assert.equal(2 + 2, 4);
  });

  // Test firestore rules
  it('Allow a user to edit their own document', async () => {
    const docId = 'form123';
    const admin = getAdminFirestore();
    await admin
      .collection('test_documents')
      .doc(docId)
      .set({ content: 'before', authorId: myId });

    const db = getFirestore(myAuth);
    const testDoc = db.collection('test_documents').doc(docId);
    await firebase.assertSucceeds(testDoc.update({ content: 'after' }));
  });

  it("Don't allow a user to edit somebody else's document", async () => {
    const docId = 'doc123';
    const admin = getAdminFirestore();
    await admin
      .collection('test_documents')
      .doc(docId)
      .set({ content: 'before', authorId: theirId });

    const db = getFirestore(myAuth);
    const testDoc = db.collection('test_documents').doc(docId);
    await firebase.assertFails(testDoc.update({ content: 'after' }));
  });
});
