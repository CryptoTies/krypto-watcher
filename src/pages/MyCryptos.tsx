import React, { useState, useEffect, useCallback } from 'react';
import useFetch from '../hooks/UseFetch';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebaseConfig';
import { cryptoAPI } from '../utils/crypto-api';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ICoin } from '../models/ICoin';
import { ICryptoApiRes } from '../models/ICryptoApiRes';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/MyCryptos.module.css';

function MyCryptos() {
  const [myCoins, setMyCoins] = useState<ICoin[]>([]);

  const [authUser, authLoading, authError] = useAuthState(auth);

  const [coinsData, coinsLoading, coinsError] = useFetch(`${cryptoAPI}?skip=0`);

  const navigate = useNavigate();

  const showPage =
    authUser &&
    !authLoading &&
    !authError &&
    coinsData &&
    !coinsLoading &&
    !coinsError;

  const getMyCryptos = useCallback(async () => {
    if (authUser && coinsData) {
      const userRef = doc(db, 'users', authUser.uid);
      const userDoc = await getDoc(userRef);
      const myFavCoins = userDoc.data()?.favorites;
      const coins = (coinsData as ICryptoApiRes).coins;
      const filteredCoins = (coins as ICoin[])?.filter((coin: ICoin) =>
        myFavCoins.includes(coin.id)
      );

      setMyCoins(
        filteredCoins.map((coin: ICoin) => ({ ...coin, isFavorited: true }))
      );
    }
  }, [authUser, coinsData]);

  useEffect(() => {
    if (showPage) {
      getMyCryptos();
    }

    if (!authUser && !authLoading) {
      navigate('/login');
    }
  }, [showPage, getMyCryptos, navigate, authUser, authLoading]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  const handleToggleFavorite = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (authUser) {
      const { id } = e.target as HTMLButtonElement;
      const userRef = doc(db, 'users', authUser.uid);
      const userDoc = await getDoc(userRef);

      setMyCoins(myCoins.filter((coin: ICoin) => coin.id !== id));

      await updateDoc(userRef, {
        favorites: userDoc
          .data()
          ?.favorites.filter((coin: string) => coin !== id),
      });
    }
  };

  return (
    <>
      {showPage && (
        <div className={styles['my-cryptos']}>
          <h1>My Account</h1>
          <div>
            {myCoins.map((coin: ICoin) => (
              <div key={coin.id}>
                <h2>{coin.name}</h2>
                <img src={coin.icon} alt={coin.name} loading='lazy' />
                {coin.isFavorited && (
                  <button id={coin.id} onClick={handleToggleFavorite}>
                    Favorited
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default MyCryptos;
