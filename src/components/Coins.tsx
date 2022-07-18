import Coin from './Coin';
import { ICoin } from '../models/ICoin';
import styles from '../styles/Coins.module.css';

interface Props {
  coins: ICoin[];
  slicedCoins: never[];
}

const Coins = ({ coins, slicedCoins }: Props) => {
  return (
    <div className={styles.coins}>
      {slicedCoins.map((_, idx) => (
        <Coin key={idx} coin={coins[idx]} />
      ))}
    </div>
  );
};

export default Coins;
