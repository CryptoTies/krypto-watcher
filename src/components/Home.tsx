import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebaseConfig';
import { cryptoAPI } from '../utils/crypto-api';
import { ICoin } from '../models/ICoin';
import useFetch from '../hooks/UseFetch';
import Coins from './Coins';
import styles from '../styles/Home.module.css';

const Home = () => {
  const {
    allData: { data: coins, loading: coinsLoading, error: coinsError },
  } = useFetch(`${cryptoAPI}?skip=0`);

  const [authUser, authLoading, authError] = useAuthState(auth);

  const navigate = useNavigate();

  const updateUserRef = useRef(() => {});

  const anyErrors = coinsError || authError;

  const showHomePage =
    authUser && !authLoading && coins && !coinsLoading && !anyErrors;

  updateUserRef.current = async () => {
    if (authUser) {
      const firstName = authUser.displayName
        ? authUser.displayName.split(' ')[0]
        : null;
      const lastName = authUser.displayName
        ? authUser.displayName.split(' ')[1]
        : null;
      const userRef = doc(db, 'users', authUser.uid);
      try {
        await setDoc(
          userRef,
          {
            firstName,
            lastName,
            email: authUser.email,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (authUser && !authLoading) {
      updateUserRef.current();
    }
    if (!authUser && !authLoading) {
      navigate('/login');
    }
  }, [authLoading, authUser, navigate]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (anyErrors) {
    console.error(anyErrors);
    if (anyErrors instanceof Error) {
      return <div>Error: {anyErrors.message}</div>;
    }
  }

  return (
    <>
      {showHomePage && (
        <div className={styles.home}>
          <h1>Welcome to Krypto Watcher!</h1>
          <Coins coins={coins as ICoin[]} />
        </div>
      )}
    </>
  );
};

export default Home;
