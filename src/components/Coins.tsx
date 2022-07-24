import Coin from './Coin';
import { ICoin } from '../models/ICoin';
import styles from '../styles/Coins.module.css';

interface Props {
  coins: ICoin[];
  slicedCoins: never[];
  searchQuery: string;
  handleFetchMoreCoinsState: (state: boolean) => void;
}

const Coins = ({
  coins,
  slicedCoins,
  searchQuery,
  handleFetchMoreCoinsState,
}: Props) => {
  const handleFilteredCoins = () => {
    if (searchQuery.length > 0) {
      handleFetchMoreCoinsState(false);
      return coins.filter((coin: ICoin) =>
        coin.id.includes(searchQuery.toLowerCase().trim())
      );
    } else {
      handleFetchMoreCoinsState(true);
      return coins
        .slice(0, slicedCoins.length)
        .filter((coin: ICoin) =>
          coin.id.includes(searchQuery.toLowerCase().trim())
        );
    }
  };
  return (
    <div className={styles.coins}>
      {handleFilteredCoins().map(coin => (
        <Coin key={coin.id} coin={coins[coin.rank - 1]} />
      ))}
    </div>
  );
};

export default Coins;
