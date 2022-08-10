import React, { useState, useEffect, useMemo } from 'react';
import useFetch from '../hooks/UseFetch';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebaseConfig';
import { cryptoAPI } from '../utils/crypto-api';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ICoin } from '../models/ICoin';
import { ICryptoApiRes } from '../models/ICryptoApiRes';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/MyCryptos.module.css';
import { getChartData } from '../utils/getChartData';
import Chart from 'react-apexcharts';
import { IChart } from '../models/IChart';
import { configChartOptions } from '../utils/configChartOptions';
import { Button } from '@mui/material';
import SearchBar from '../components/SearchBar';

function MyCryptos() {
  const [myCoins, setMyCoins] = useState<ICoin[]>([]);
  const [charts, setCharts] = useState<IChart[][]>([]);
  const [authUser, authLoading, authError] = useAuthState(auth);
  const [coinsData, coinsLoading, coinsError] = useFetch(`${cryptoAPI}?skip=0`);

  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const showPage =
    authUser &&
    !authLoading &&
    !authError &&
    coinsData &&
    !coinsLoading &&
    !coinsError;

  useEffect(() => {
    if (!authUser && !authLoading) {
      navigate('/login');
    }
  }, [navigate, authUser, authLoading]);

  const memoCoins = useMemo(() => {
    async function memoCoinsFn() {
      const getMyCoins = async () => {
        if (authUser && coinsData) {
          const userRef = doc(db, 'users', authUser.uid);
          const userDoc = await getDoc(userRef);
          const myFavCoins = userDoc.data()?.favorites;
          const coins = (coinsData as ICryptoApiRes).coins;
          const filteredCoins =
            (coins as ICoin[]).filter((coin: ICoin) =>
              myFavCoins.includes(coin.id)
            ) ?? [];
          return filteredCoins.map((coin: ICoin) => ({
            ...coin,
            isFavorited: true,
          }));
        }
      };

      if (showPage) {
        return await getMyCoins();
      } else {
        return [];
      }
    }
    return memoCoinsFn();
  }, [showPage, authUser, coinsData]);

  useEffect(() => {
    async function awaitedMemoCoinsFn() {
      const awaitedMemoCoins = await memoCoins;
      if (Array.isArray(awaitedMemoCoins)) {
        setMyCoins(awaitedMemoCoins);
      }
    }
    awaitedMemoCoinsFn();
  }, [memoCoins]);

  useEffect(() => {
    async function chartsFn() {
      if (showPage) {
        const awaitedCharts = await Promise.all(
          myCoins.map(async (coin: ICoin) => {
            return await getChartData(coin.symbol);
          })
        );
        setCharts(awaitedCharts as IChart[][]);
      }
    }
    chartsFn();
  }, [myCoins, showPage]);

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
    <div className={styles['my-cryptos']}>
      <SearchBar
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder='Search My Coins...'
      />
      {showPage && myCoins.length > 0 && charts.length > 0 && (
        <ul className={styles['my-cryptos__list']}>
          {myCoins.map((coin: ICoin, idx: number) => (
            <li key={coin.id} className={styles['my-cryptos__listItem']}>
              <div className={styles['my-cryptos__listSubContainer']}>
                <div className={styles['my-cryptos__iconContainer']}>
                  <h2 className={styles['my-cryptos__name']}>{coin.name}</h2>
                  <img
                    src={coin.icon}
                    alt={coin.name}
                    loading='lazy'
                    className={styles.iconImg}
                  />
                  {coin.isFavorited && (
                    <Button
                      id={coin.id}
                      onClick={handleToggleFavorite}
                      variant='outlined'
                      color='warning'
                      className={styles.removeBtn}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className={styles['my-cryptos__chartContainer']}>
                  <Chart
                    className={styles['my-cryptos__chart']}
                    options={
                      configChartOptions(coin.symbol) as ApexCharts.ApexOptions
                    }
                    series={[
                      {
                        data: charts[idx],
                      },
                    ]}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyCryptos;
