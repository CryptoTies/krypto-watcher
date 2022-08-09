import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ICoin } from '../models/ICoin';
import { formatPrice } from '../utils/formatPrice';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from '../styles/Coin.module.css';
import { getChartData } from '../utils/getChartData';
import Chart from 'react-apexcharts';
import { IChart } from '../models/IChart';
import { configChartOptions } from '../utils/configChartOptions';
import { Button } from '@mui/material';

interface Props {
  coin: ICoin;
}

const Coin = ({ coin: { id, name, symbol, price, icon, rank } }: Props) => {
  const [authUser] = useAuthState(auth);
  const [isCoinFavorited, setIsCoinFavorited] = useState(false);
  const [isFavInquisitionLoading, setIsFavInquisitionLoading] = useState(true);
  const [chart, setChart] = useState<IChart[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(true);

  const isCoinInFavs = useCallback(
    async (coinName: string) => {
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        const userDoc = await getDoc(userRef);
        return userDoc.data()?.favorites.includes(coinName);
      }
    },
    [authUser]
  );

  useEffect(() => {
    isCoinInFavs(id).then(res => {
      setIsCoinFavorited(res);
      setIsFavInquisitionLoading(false);
    });
  }, [id, isCoinInFavs]);

  useEffect(() => {
    getChartData(symbol)
      .then(res => {
        setChart(res as IChart[]);
        setIsChartLoading(false);
      })
      .catch(err => err);
  }, [symbol]);

  const handleToggleFavorite = async () => {
    if (authUser) {
      const userRef = doc(db, 'users', authUser.uid);
      const userDoc = await getDoc(userRef);

      // doesn't rerender right away so placement is ok
      setIsCoinFavorited(isCoinFavorited => !isCoinFavorited);

      await updateDoc(userRef, {
        favorites: isCoinFavorited
          ? userDoc.data()?.favorites.filter((coin: string) => coin !== id)
          : [...userDoc.data()?.favorites, id],
      });
    }
  };

  if (isFavInquisitionLoading || isChartLoading) {
    return <></>;
  }

  return (
    <li className={styles.coin}>
      <div className={styles.coin__subContainer}>
        <div className={styles.coin__iconContainer}>
          <h3 className={styles.coin__rank}>Rank {rank}</h3>
          <Link to={`/coin/${id}`} style={{ color: 'blue' }}>
            <h2 className={styles.coin__name}>{name}</h2>
          </Link>
          <p className={styles.coin__price}>Price: {formatPrice(price)}</p>
          <img
            src={icon}
            alt={name}
            loading='lazy'
            className={styles.coin__img}
          />
          <Button
            onClick={handleToggleFavorite}
            className={styles.coin__favBtn}
            variant='contained'
            color='success'
          >
            {isCoinFavorited ? 'Favorited' : 'Favorite'}
          </Button>
        </div>
        <div className={styles.coin__chartContainer}>
          <Chart
            className={styles.coin__chart}
            options={configChartOptions(symbol) as ApexCharts.ApexOptions}
            series={[
              {
                data: chart,
              },
            ]}
          />
        </div>
      </div>
    </li>
  );
};

export default memo(Coin);
