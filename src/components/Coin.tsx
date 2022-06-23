import { Link } from 'react-router-dom';
import { ICoin } from '../models/ICoin';
import style from './styles/Coin.module.css';

const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(price);
};

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
