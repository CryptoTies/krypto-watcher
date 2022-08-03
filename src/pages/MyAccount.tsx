import { Fragment, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

enum EProvider {
  GOOGLE = 'google.com',
  NATIVE = 'password',
}

const MyAccount = () => {
  const [authUser, authLoading, authError] = useAuthState(auth);
  const [checkedUser, setCheckedUser] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const navigate = useNavigate();

  const { uuid: paramsUUID } = useParams();

  const authProvider = (authUser as any)?.reloadUserInfo?.providerUserInfo[0]
    .providerId;

  const showPage =
    authUser &&
    authUser.uid === paramsUUID &&
    !authLoading &&
    !authError &&
    Object.keys(checkedUser).length > 0;

  const findUser = useCallback(async () => {
    const userRef = doc(db, 'users', paramsUUID as string);

    const userDoc = await getDoc(userRef);

    setCheckedUser({
      ...userDoc.data(),
    });
  }, [paramsUUID]);

  useEffect(() => {
    findUser();
  }, [findUser]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (
    authUser?.uid !== paramsUUID &&
    !authLoading &&
    !authError &&
    Object.keys(checkedUser).length === 0
  ) {
    navigate('/');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword === newPasswordConfirm) {
      try {
        await updatePassword(authUser!, newPassword);
        alert('Password updated');
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Passwords do not match');
    }
    setNewPassword('');
    setNewPasswordConfirm('');
  };

  console.log('AUTHUSER', authUser);

  return (
    <Fragment>
      {showPage && (
        <div>
          <h1>My Account</h1>
          <p>Full Name: {authUser.displayName}</p>
          <p>Email: {authUser.email}</p>
          <p>Email Verified: {authUser.emailVerified.toString()}</p>
          {authUser.phoneNumber && <p>Phone Number: {authUser.phoneNumber}</p>}
          <p>Last Signed In: {authUser.metadata.lastSignInTime}</p>
          {authUser.phoneNumber && <p>Phone Number: {authUser.phoneNumber}</p>}
          {authProvider === EProvider.NATIVE && (
            <form onSubmit={handleSubmit}>
              <label htmlFor='changePW'>Change Password</label>
              <input
                type='password'
                id='changePW'
                onChange={e => setNewPassword(e.target.value)}
                value={newPassword}
              />
              <label htmlFor='confirmPW'>Confirm Password</label>
              <input
                type='password'
                id='ConfirmPW'
                onChange={e => setNewPasswordConfirm(e.target.value)}
                value={newPasswordConfirm}
              />
              <button type='submit'>Submit</button>
            </form>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default MyAccount;
