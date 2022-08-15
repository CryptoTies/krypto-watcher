import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ICheckedUser } from '../models/ICheckedUser';
import { formatPhoneNum } from '../utils/formatPhoneNum';
import { Helmet } from 'react-helmet';
import { EProvider } from '../models/EProvider';
import { Link } from 'react-router-dom';
import styles from '../styles/MyAccount.module.css';

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

  return (
    <>
      {showPage && (
        <>
          <Helmet>
            <title>My Account | Krypto Watcher</title>
          </Helmet>
          <div className={styles['my-account']}>
            <h1 className={styles['my-account__header']}>My Account</h1>
            <div className={styles.container}>
              <div className={styles.nameContainer}>
                <p>Full Name: {authUser.displayName}</p>
              </div>
              <div className={styles.emailContainer}>
                <p>Email: {authUser.email}</p>
              </div>
              <div className={styles.verifiedContainer}>
                <p>Email Verified: {authUser.emailVerified.toString()}</p>
              </div>
              {(authUser.phoneNumber || checkedUser.phoneNumber) && (
                <div className={styles.phoneContainer}>
                  <p>
                    Phone Number:{' '}
                    {formatPhoneNum(authUser.phoneNumber as string) ||
                      formatPhoneNum(checkedUser.phoneNumber as string)}
                  </p>
                </div>
              )}
              <div className={styles.signedInContainer}>
                <p>Last Signed In: {authUser.metadata.lastSignInTime}</p>
              </div>
            </div>

            {authProvider === EProvider.NATIVE && (
              <Link to='/change-password' className={styles['changePassword']}>
                Change Password
              </Link>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MyAccount;
