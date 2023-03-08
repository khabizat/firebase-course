import React from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { TODOS } from '../../firebase/index';
import firebase from '../../firebase/clientApp';
import LoadingError from './LoadingError';
import TodoItem from './TodoItem';

const TodoList = ({ uid }) => {
  const db = firebase.firestore();

  const [items, loading, error] = useCollectionData(
    db.collection(TODOS).where('uid', '==', uid).orderBy('createdAt', 'desc'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <LoadingError data={items} loading={loading} error={error}>
      {!items?.length && (
        <p className="mt-2 max-w-xl text-sm text-gray-500">Nothing here yet</p>
      )}
      <form>
        {items && items.map((item) => <TodoItem key={item.id} item={item} />)}
      </form>
    </LoadingError>
  );
};

export default TodoList;
