import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

const chartOptions = {
  options: {
    chart: {
      type: 'candlestick',
      height: 350,
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  },
};

function MyCryptos() {
  const [myCoins, setMyCoins] = useState<ICoin[]>([]);

  const [authUser, authLoading, authError] = useAuthState(auth);

  const [coinsData, coinsLoading, coinsError] = useFetch(`${cryptoAPI}?skip=0`);

  const [charts, setCharts] = useState<any[]>([]);

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
    async function main() {
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
    return main();
  }, [showPage, authUser, coinsData]);

  useEffect(() => {
    async function main() {
      const awaitedMemoCoins = await memoCoins;
      if (Array.isArray(awaitedMemoCoins)) {
        setMyCoins(awaitedMemoCoins);
      }
    }
    main();
  }, [memoCoins]);

  useEffect(() => {
    async function main() {
      console.log('GET CHAR DATA: ', await getChartData('BTC'));
      if (showPage) {
        const awaitedCharts = await Promise.all(
          myCoins.map(async (coin: ICoin) => {
            const chartData = await getChartData(coin.symbol);
            console.log('awaited chart data', chartData);
            return chartData;
          })
        );
        console.log('USE EFFECT', awaitedCharts);
        setCharts(awaitedCharts);
      }
    }
    main();
  }, [myCoins, showPage]);

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

  console.log('CHARTS STATE', charts);

  return (
    <>
      {showPage && (
        <div className={styles['my-cryptos']}>
          <h1>My Account</h1>
          {myCoins.length > 0 ? (
            <ul className={styles['my-cryptos__list']}>
              {myCoins.map((coin: ICoin) => (
                <li key={coin.id}>
                  <h2>{coin.name}</h2>
                  <img src={coin.icon} alt={coin.name} loading='lazy' />
                  {coin.isFavorited && (
                    <button id={coin.id} onClick={handleToggleFavorite}>
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No coins added yet</p>
          )}
          <section>
            <h1>Charts</h1>
            {charts.length > 0 && (
              <div>
                {charts.map((chart: any, idx: number) => (
                  <Chart
                    options={{
                      chart: {
                        type: 'candlestick',
                        height: 350,
                      },
                      title: {
                        text: 'CandleStick Chart',
                        align: 'left',
                      },
                      xaxis: {
                        type: 'datetime',
                      },
                      yaxis: {
                        tooltip: {
                          enabled: true,
                        },
                      },
                    }}
                    series={[
                      {
                        data: chart,
                      },
                    ]}
                    type='candlestick'
                    width='100%'
                    height={320}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}

export default MyCryptos;
