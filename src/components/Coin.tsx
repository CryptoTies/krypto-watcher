import { Link } from 'react-router-dom';
import { ICoin } from '../models/ICoin';
import style from '../styles/Coin.module.css';
import { formatPrice } from '../utils/formatPrice';

interface Props {
  coin: ICoin;
}

const Coin = ({ coin: { id, name, symbol, price } }: Props) => {
  return (
    <div className={style.coin}>
      <Link to={`/coin/${id}`}>
        <h2>Name: {name}</h2>
      </Link>
      <p>Symbol: {symbol}</p>
      <p>Price: {formatPrice(price)}</p>
    </div>
  );
};

export default Coin;