import { Link } from 'react-router-dom';
import { ICoin } from '../models/ICoin';
import { formatPrice } from '../utils/formatPrice';
import style from '../styles/Coin.module.css';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState, useEffect, useCallback } from 'react';

import { doc, getDoc } from 'firebase/firestore';

interface Props {
  coin: ICoin;
}

const Coin = ({
  coin: { id, name, symbol, price, icon, rank, isFavorited },
}: Props) => {
  const [authUser] = useAuthState(auth);
  const [isCoinFavorited, setIsCoinFavorited] = useState(null);

  const checkIfFavorited = useCallback(
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
    checkIfFavorited(id).then(res => setIsCoinFavorited(res));
  }, [id, checkIfFavorited]);

  return (
    <div className={style.coin}>
      <h3>Rank {rank}</h3>
      <Link to={`/coin/${id}`}>
        <h2>Name: {name}</h2>
      </Link>
      <p>Symbol: {symbol}</p>
      <p>Price: {formatPrice(price)}</p>
      <img src={icon} alt={name} />
      <button>
        {isCoinFavorited
          ? 'Favorited'
          : isCoinFavorited === false
          ? 'Favorite'
          : null}
      </button>
    </div>
  );
};

export default Coin;
