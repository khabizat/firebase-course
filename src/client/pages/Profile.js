import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { USERS, updateUser } from '../../firebase/index';
import firebase from '../../firebase/clientApp';

import { useUser } from '../components/user-context';
import LoadingError from '../components/LoadingError';
import Card from '../components/Card';
import ProfileForm from '../components/ProfileForm';

const Profile = () => {
  const { user } = useUser();
  const { uid } = useParams();

  const db = firebase.firestore();

  const [userDoc, loading, error] = useDocumentData(
    db.collection(USERS).doc(uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  // Check if current user is an admin
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    if (user) {
      db.collection(USERS)
        .doc(user.uid)
        .get()
        .then((currentUser) => setAdminMode(currentUser.data().isAdmin));
    }
  }, []);

  // Authenticated user with admin status changes the admin status of another user
  const handleAdminStatusUpdate = (event) =>{
    event.preventDefault();
    updateUser(userDoc.uid, {isAdmin: !userDoc.isAdmin});
  }

  return (
    <main>
      <Card>
        <h1 className="text-2xl leading-6 font-medium text-gray-900">
          {`Edit ${userDoc?.uid === user.uid ? 'your' : 'user'} profile`}
        </h1>
      </Card>

      <LoadingError data={userDoc} loading={loading} error={error}>
        {userDoc && (
          <>
            <Card>
              <ProfileForm
                userDoc={userDoc}
                isCurrentUser={userDoc.uid === user.uid}
                adminMode={adminMode}
              />
            </Card>
            {/* Checkbox to update admin status */}
            {adminMode && userDoc.uid !== user.uid && (
              <Card>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                Admin Tools
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                Click checkbox to change {userDoc.displayName}'s admin status.
                </p>
                <label className="block mt-4">
                  <input 
                    type="checkbox"
                    checked={userDoc ? userDoc.isAdmin : false}
                    onChange={handleAdminStatusUpdate}
                    className="mr-3 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                </label>
              </Card>
            )}
          </>
        )}
      </LoadingError>
    </main>
  );
};

export default Profile;
