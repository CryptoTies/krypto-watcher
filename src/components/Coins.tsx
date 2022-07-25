import { useEffect, useState } from 'react';
import Coin from './Coin';
import { ICoin } from '../models/ICoin';
import styles from '../styles/Coins.module.css';

interface Props {
  coins: ICoin[];
  slicedCoins: never[];
  searchQuery: string;
  handleFetchMoreCoinsState: (state: boolean) => void;
  fetchMoreCoinsState: boolean;
  coinOptionsState: string;
}

const Coins = ({
  coins,
  slicedCoins,
  searchQuery,
  handleFetchMoreCoinsState,
  fetchMoreCoinsState,
}: Props) => {
  const [filteredCoins, setFilteredCoins] = useState<ICoin[]>([]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      handleFetchMoreCoinsState(false);
    } else {
      handleFetchMoreCoinsState(true);
    }
  }, [searchQuery, handleFetchMoreCoinsState]);

  // edit filtering logic here
  useEffect(() => {
    const handleFilteredCoins = () => {
      if (!fetchMoreCoinsState) {
        setFilteredCoins(
          coins.filter((coin: ICoin) =>
            coin.id.includes(searchQuery.toLowerCase().trim())
          )
        );
      } else {
        setFilteredCoins(
          coins
            .slice(0, slicedCoins.length)
            .filter((coin: ICoin) =>
              coin.id.includes(searchQuery.toLowerCase().trim())
            )
        );
      }
    };
    handleFilteredCoins();
  }, [coins, slicedCoins, searchQuery, fetchMoreCoinsState]);

  return (
    <div className={styles.coins}>
      {filteredCoins.map(coin => (
        <Coin key={coin.id} coin={coins[coin.rank - 1]} />
      ))}
    </div>
  );
};

export default Coins;
