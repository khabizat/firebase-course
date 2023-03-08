import toast from 'react-hot-toast';
import firebase from './clientApp';
import { TODOS } from './utility';

async function remove(collection, id) {
  const db = firebase.firestore();

  if (!collection || !id) {
    throw new ReferenceError('No collection or id provided');
  }

  const documentRef = db.collection(collection).doc(id);

  await documentRef.delete();
  return documentRef.id;
}

export async function deleteTodo(id) {
  remove(TODOS, id)
    .then((docId) => {
      console.log(`Item deleted at ${TODOS}/${id}`);
      toast.success('Item deleted');
      return docId;
    })
    .catch((error) => {
      console.error(error);
      toast.error('Error deleting item');
    });
}
