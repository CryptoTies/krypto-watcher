import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ICoin } from '../models/ICoin';
import { formatPrice } from '../utils/formatPrice';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import style from '../styles/Coin.module.css';

interface Props {
  coin: ICoin;
}

const Coin = ({ coin: { id, name, symbol, price, icon, rank } }: Props) => {
  const [authUser] = useAuthState(auth);
  const [isCoinFavorited, setIsCoinFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    });
  }, [id, isCoinInFavs]);

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

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <li className={style.coin}>
          <h3 className={style.coin__rank}>Rank {rank}</h3>
          <Link to={`/coin/${id}`} style={{ color: 'blue' }}>
            <h2 className={style.coin__name}>Name: {name}</h2>
          </Link>
          <p className={style.coin__symbol}>Symbol: {symbol}</p>
          <p className={style.coin__price}>Price: {formatPrice(price)}</p>
          <img
            src={icon}
            alt={name}
            loading='lazy'
            className={style.coin__img}
          />
          <button onClick={handleToggleFavorite} className={style.coin__favBtn}>
            {isCoinFavorited ? 'Favorited' : 'Favorite'}
          </button>
        </li>
      )}
    </>
  );
};

export default memo(Coin);
