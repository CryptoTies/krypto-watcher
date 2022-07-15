import { Fragment, useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface Props {}

const MyAccount = (props: Props) => {
  const [authUser, authLoading, authError] = useAuthState(auth);
  const [checkedUser, setCheckedUser] = useState({});

  const navigate = useNavigate();

  const { uuid: paramsUUID } = useParams();

  const userRef = doc(db, 'users', paramsUUID as string);

  const findUser = async () => {};

  useEffect(() => {
    getDoc(userRef)
      .then(doc => {
        return {
          ...doc.data(),
          uuid: doc.id,
        };
      })
      .then(loadedDoc => setCheckedUser(loadedDoc))
      .catch(err => console.error(err));
  }, []);

  console.log('checking: ', checkedUser);

  if (!authUser && !authLoading) {
    navigate('/', { replace: true });
  }

  return <Fragment>{authUser && !authLoading && <h1>My Account</h1>}</Fragment>;
};

export default MyAccount;
