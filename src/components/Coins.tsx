import Coin from './Coin';
import { ICoin } from '../models/ICoin';
import styles from '../styles/Coins.module.css';

interface Props {
  coins: ICoin[];
  slicedCoins: never[];
  searchQuery: string;
}

const Coins = ({ coins, slicedCoins, searchQuery }: Props) => {
  const handleFilteredCoins = () => {
    if (searchQuery.length > 0) {
      return coins.filter((coin: ICoin) =>
        coin.id.includes(searchQuery.toLowerCase().trim())
      );
    } else {
      return coins
        .slice(0, slicedCoins.length)
        .filter((coin: ICoin) =>
          coin.id.includes(searchQuery.toLowerCase().trim())
        );
    }
  };
  console.log('handleFilteredCoins', handleFilteredCoins());
  return (
    <div className={styles.coins}>
      {handleFilteredCoins().map((coin, idx) => (
        <Coin key={idx} coin={coins[coin.rank - 1]} />
      ))}
    </div>
  );
};

export default Coins;
