import { Fragment, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

const MyAccount = () => {
  const [authUser, authLoading, authError] = useAuthState(auth);
  const [checkedUser, setCheckedUser] = useState({});

  const navigate = useNavigate();

  const { uuid: paramsUUID } = useParams();

  const findUser = useCallback(async () => {
    const userRef = doc(db, 'users', paramsUUID as string);

    const userDoc = await getDoc(userRef);

    setCheckedUser({
      ...userDoc.data(),
      // uuid: userDoc.id,
    });
  }, [paramsUUID]);

  useEffect(() => {
    findUser();
  }, [findUser]);

  console.log('authUser: ', authUser);
  console.log('authLoading: ', authLoading);
  console.log('authError: ', authError);
  console.log('Checked user: ', checkedUser);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  const showPage =
    authUser?.uid === paramsUUID &&
    !authLoading &&
    !authError &&
    Object.keys(checkedUser).length > 0;

  if (authUser?.uid !== paramsUUID && !authLoading && !authError) {
    navigate('/');
  }

  return <Fragment>{showPage && <h1>My Account</h1>}</Fragment>;
};

export default MyAccount;
