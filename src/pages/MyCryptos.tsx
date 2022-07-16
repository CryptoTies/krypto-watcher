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

      setMyCoins(filteredCoins);
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

  return (
    <>
      {noIssues && (
        <div>
          <h1>My Account</h1>
          <ul>
            {myCoins.map((coin: ICoin) => (
              <li key={coin.id}>{coin.name}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default MyCryptos;
