import Coin from './Coin';
import { ICoin } from '../models/ICoin';
import styles from '../styles/Coins.module.css';

interface Props {
  coins: ICoin[];
}

const Coins = ({ coins }: Props) => {
  console.log(coins);
  return (
    <div className={styles.coins}>
      {coins.map(coin => (
        <Coin key={coin.id} coin={coin} />
      ))}
    </div>
  );
};

export default Coins;
