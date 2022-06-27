import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebaseConfig';
import axios from 'axios';
import { cryptoAPI } from '../utils/crypto-api';
import { ICoin } from '../models/ICoin';
import { ICryptoApiRes } from '../models/ICryptoApiRes';
import useFetch from '../hooks/UseFetch';
import Coins from './Coins';
import styles from '../styles/Home.module.css';
import { IFetchedData } from '../models/IFetchedData';

const Home = () => {
  const [cryptoData, setCryptoData] = useState<ICoin[]>([]);
  const updateUserRef = useRef(() => {});

  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);

  const fetchCoins = async () => {
    const {
      data: { coins },
    } = await axios.get<ICryptoApiRes>(`${cryptoAPI}?skip=0`);
    setCryptoData(coins);
  };

  updateUserRef.current = async () => {
    if (user) {
      const firstName = user.displayName
        ? user.displayName.split(' ')[0]
        : null;
      const lastName = user.displayName ? user.displayName.split(' ')[1] : null;
      const userRef = doc(db, 'users', user.uid);
      try {
        await setDoc(
          userRef,
          {
            firstName,
            lastName,
            email: user.email,
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
    if (user && !loading) {
      updateUserRef.current();
      fetchCoins();
    }
    if (!user && !loading) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return (
      <div>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <>
      {user && !loading && (
        <div className={styles.home}>
          <h1>Welcome to Krypto Watcher!</h1>
          <Coins coins={cryptoData} />
        </div>
      )}
    </>
  );
};

export default Home;
