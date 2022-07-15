import { Link } from 'react-router-dom';
import { ICoin } from '../models/ICoin';
import { formatPrice } from '../utils/formatPrice';
import style from '../styles/Coin.module.css';

interface Props {
  coin: ICoin;
}

const Coin = ({ coin: { id, name, symbol, price, icon, rank } }: Props) => {
  return (
    <div className={style.coin}>
      <h3>Rank {rank}</h3>
      <Link to={`/coin/${id}`}>
        <h2>Name: {name}</h2>
      </Link>
      <p>Symbol: {symbol}</p>
      <p>Price: {formatPrice(price)}</p>
      <img src={icon} alt={name} />
    </div>
  );
};

export default Coin;
