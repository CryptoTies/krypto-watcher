import { useState, useEffect, useCallback } from 'react';
import useFetch from '../hooks/UseFetch';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebaseConfig';
import { cryptoAPI } from '../utils/crypto-api';
import { getDoc, doc } from 'firebase/firestore';
import { ICoin } from '../models/ICoin';
import { ICryptoApiRes } from '../models/ICryptoApiRes';

function MyCryptos() {
  const [myCoins, setMyCoins] = useState<ICoin[]>([]);

  const [authUser, authLoading, authError] = useAuthState(auth);

  const [coinsData, coinsLoading, coinsError] = useFetch(`${cryptoAPI}?skip=0`);

  const getMyCryptos = useCallback(async () => {
    if (authUser && coinsData) {
      const userRef = doc(db, 'users', authUser.uid);
      const userDoc = await getDoc(userRef);
      const myFavCoins = userDoc.data()?.favorites;
      const coins = (coinsData as ICryptoApiRes).coins;
      const filteredCoins = (coins as ICoin[])?.filter((coin: ICoin) =>
        myFavCoins.includes(coin.id)
      );

      setMyCoins(filteredCoins);
    }
  }, [authUser, coinsData]);

  useEffect(() => {
    if (
      authUser &&
      !authLoading &&
      !authError &&
      coinsData &&
      !coinsLoading &&
      !coinsError
    ) {
      getMyCryptos();
    }
  }, [
    authUser,
    authLoading,
    authError,
    coinsData,
    coinsLoading,
    coinsError,
    getMyCryptos,
  ]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  // const showPage = authUser && !authLoading && !coinsLoading && !coinsError;

  return (
    <>
      My Cryptos
      <div>
        {myCoins.map((coin: ICoin) => (
          <div key={coin.id}>{coin.name}</div>
        ))}
      </div>
    </>
  );
}

export default MyCryptos;
