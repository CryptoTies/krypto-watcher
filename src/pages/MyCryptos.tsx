import { useState, useEffect, useCallback } from 'react';
import useFetch from '../hooks/UseFetch';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebaseConfig';
import { cryptoAPI } from '../utils/crypto-api';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ICoin } from '../models/ICoin';
import { ICryptoApiRes } from '../models/ICryptoApiRes';

function MyCryptos() {
  const [myCoins, setMyCoins] = useState<ICoin[]>([]);

  const [authUser, authLoading, authError] = useAuthState(auth);

  const [coinsData, coinsLoading, coinsError] = useFetch(`${cryptoAPI}?skip=0`);

  const [isCoinFavorited, setIsCoinFavorited] = useState(false);

  const noIssues =
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
    if (noIssues) {
      getMyCryptos();
    }
  }, [noIssues, getMyCryptos]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  const handleToggleFavorite = async (e: any) => {
    if (authUser) {
      const { id } = e.target;
      console.log(id);
      const userRef = doc(db, 'users', authUser.uid);
      const userDoc = await getDoc(userRef);

      setMyCoins(
        myCoins.map((coin: ICoin) =>
          coin.id === id ? { ...coin, isFavorited: !coin.isFavorited } : coin
        )
      );

      await updateDoc(userRef, {
        favorites: isCoinFavorited
          ? userDoc.data()?.favorites.filter((coin: string) => coin !== id)
          : [...userDoc.data()?.favorites, id],
      });
    }
  };

  return (
    <>
      {noIssues && (
        <div>
          <h1>My Account</h1>
          <div>
            {myCoins.map((coin: ICoin) => (
              <div key={coin.id}>
                <h2>{coin.name}</h2>
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
