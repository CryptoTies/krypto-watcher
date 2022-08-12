import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { ICheckedUser } from '../models/ICheckedUser';
import { formatPhoneNum } from '../utils/formatPhoneNum';
import { Helmet } from 'react-helmet';
import styles from '../styles/MyAccount.module.css';

enum EProvider {
  GOOGLE = 'google.com',
  NATIVE = 'password',
}

const MyAccount = () => {
  const [authUser, authLoading, authError] = useAuthState(auth);
  const [checkedUser, setCheckedUser] = useState<ICheckedUser>({
    email: '',
    favorites: [],
    firstName: '',
    lastName: '',
    phoneNumber: null,
    lastSeen: {},
  });
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
    checkedUser.email;

  const findUser = useCallback(async () => {
    const userRef = doc(db, 'users', paramsUUID as string);

    const userDoc = await getDoc(userRef);

    setCheckedUser({
      email: userDoc.data()?.email,
      favorites: userDoc.data()?.favorites,
      firstName: userDoc.data()?.firstName,
      lastName: userDoc.data()?.lastName,
      phoneNumber: userDoc.data()?.phoneNumber ?? null,
      lastSeen: userDoc.data()?.lastSeen,
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
    checkedUser.email
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

  return (
    <>
      {showPage && (
        <>
          <Helmet>
            <title>My Account | Krypto Watcher</title>
          </Helmet>
          <div className={styles['my-account']}>
            <h1 className={styles['my-account__header']}>My Account</h1>
            <div className={styles.divContainer}>
              <p>Full Name: {authUser.displayName}</p>
            </div>
            <div className={styles.divContainer}>
              <p>Email: {authUser.email}</p>
            </div>
            <div className={styles.divContainer}>
              <p>Email Verified: {authUser.emailVerified.toString()}</p>
            </div>
            {(authUser.phoneNumber || checkedUser.phoneNumber) && (
              <div className={styles.divContainer}>
                <p>
                  Phone Number:{' '}
                  {formatPhoneNum(authUser.phoneNumber as string) ||
                    formatPhoneNum(checkedUser.phoneNumber as string)}
                </p>
              </div>
            )}
            <div className={styles.divContainer}>
              <p>Last Signed In: {authUser.metadata.lastSignInTime}</p>
            </div>

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
        </>
      )}
    </>
  );
};

export default MyAccount;
