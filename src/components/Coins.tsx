import Coin from './Coin';
import { ICoin } from '../models/ICoin';
import styles from '../styles/Coins.module.css';

interface Props {
  coins: ICoin[];
  slicedCoins: never[];
  searchQuery: string;
}

const Coins = ({ coins, slicedCoins, searchQuery }: Props) => {
  const filteredCoins = coins
    .slice(0, slicedCoins.length)
    .filter((coin: ICoin) => coin.id.includes(searchQuery.toLowerCase()));
  return (
    <div className={styles.coins}>
      {filteredCoins.map((coin, idx) => (
        <Coin key={idx} coin={coins[coin.rank - 1]} />
      ))}
    </div>
  );
};

export default Coins;
