import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';
import { auth, db } from '../../firebaseConfig';
import { cryptoAPI } from '../utils/crypto-api';
import { ICoin } from '../models/ICoin';
import useFetch from '../hooks/UseFetch';
import Coins from '../components/Coins';
import styles from '../styles/Home.module.css';
import { ICryptoApiRes } from '../models/ICryptoApiRes';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PAGINATION_NUM } from '../utils/pagination-num';

const Home = () => {
  const [coinsData, coinsLoading, coinsError] = useFetch(`${cryptoAPI}?skip=0`);

  const [authUser, authLoading, authError] = useAuthState(auth);

  const [slicedCoins, setSlicedCoins] = useState<never[]>(
    Array.from({ length: PAGINATION_NUM })
  );

  const [endOfListMsg, setEndOfListMsg] = useState('Loading...');

  const navigate = useNavigate();

  const updateUserRef = useRef(() => {});

  const anyErrors = coinsError || authError;

  const showHomePage =
    authUser &&
    !authLoading &&
    (coinsData as ICryptoApiRes) &&
    (!coinsLoading as boolean) &&
    !anyErrors;

  updateUserRef.current = async () => {
    if (authUser) {
      const firstName = authUser.displayName
        ? authUser.displayName.split(' ')[0]
        : null;
      const lastName = authUser.displayName
        ? authUser.displayName.split(' ')[1]
        : null;
      const userRef = doc(db, 'users', authUser.uid);
      const userDoc = await getDoc(userRef);
      try {
        await setDoc(
          userRef,
          {
            firstName,
            lastName,
            email: authUser.email,
            favorites: userDoc.data()?.favorites || [],
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

  const fetchMoreCoins = () => {
    setTimeout(() => {
      const coins = (coinsData as ICryptoApiRes).coins;
      if (
        slicedCoins.concat(Array.from({ length: PAGINATION_NUM })).length <=
        coins!.length
      ) {
        setSlicedCoins(currSliceCoins =>
          currSliceCoins.concat(Array.from({ length: PAGINATION_NUM }))
        );
      } else {
        if (coins) {
          setSlicedCoins(coins as never[]);
        }
        setEndOfListMsg('No more coins to load');
      }
    }, 750);
  };

  return (
    <>
      {showHomePage && (
        <div className={styles.home}>
          <h1>Welcome to Krypto Watcher!</h1>
          <InfiniteScroll
            dataLength={slicedCoins?.length}
            next={fetchMoreCoins}
            hasMore={true}
            loader={<h4 className='scroll-load-text'>{endOfListMsg}</h4>}
          >
            <Coins
              slicedCoins={slicedCoins}
              coins={(coinsData as ICryptoApiRes)?.coins as ICoin[]}
            />
          </InfiniteScroll>
        </div>
      )}
    </>
  );
};

export default Home;
