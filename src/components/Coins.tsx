import { useState, useEffect } from 'react';
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
  coinOptionsState,
}: Props) => {
  const [filteredCoins, setFilteredCoins] = useState<ICoin[]>([]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      handleFetchMoreCoinsState(false);
    } else {
      handleFetchMoreCoinsState(true);
    }
  }, [searchQuery, handleFetchMoreCoinsState]);

  useEffect(() => {
    const handleFilteredCoins = () => {
      let coinsFiltered: ICoin[] = [];

      if (coinOptionsState === 'popular') {
        coinsFiltered = coins.filter((coin: ICoin) =>
          coin.id.includes(searchQuery.toLowerCase().trim())
        );
      }

      if (coinOptionsState === 'expensive') {
        coinsFiltered = coins
          .filter((coin: ICoin) =>
            coin.id.includes(searchQuery.toLowerCase().trim())
          )
          .sort((a: ICoin, b: ICoin) => b.price - a.price);
      }

      if (coinOptionsState === 'cheapest') {
        coinsFiltered = coins
          .filter((coin: ICoin) =>
            coin.id.includes(searchQuery.toLowerCase().trim())
          )
          .sort((a: ICoin, b: ICoin) => a.price - b.price);
      }

      if (coinOptionsState === 'asc') {
        coinsFiltered = coins
          .filter((coin: ICoin) =>
            coin.id.includes(searchQuery.toLowerCase().trim())
          )
          .sort((a: ICoin, b: ICoin) => (a.id > b.id ? 1 : -1));
      }

      if (coinOptionsState === 'desc') {
        coinsFiltered = coins
          .filter((coin: ICoin) =>
            coin.id.includes(searchQuery.toLowerCase().trim())
          )
          .sort((a: ICoin, b: ICoin) => b.id.localeCompare(a.id));
      }

      if (!fetchMoreCoinsState) {
        setFilteredCoins(coinsFiltered);
      } else {
        setFilteredCoins(coinsFiltered.slice(0, slicedCoins.length));
      }
    };
    handleFilteredCoins();
  }, [coins, slicedCoins, searchQuery, fetchMoreCoinsState, coinOptionsState]);

  // useEffect(() => {
  //   const handleFilteredCoins = () => {
  //     let coinsFiltered: ICoin[] = coins.filter((coin: ICoin) =>
  //       coin.id.includes(searchQuery.toLowerCase().trim())
  //     );

  //     if (!fetchMoreCoinsState) {
  //       setFilteredCoins(coinsFiltered);
  //     } else {
  //       setFilteredCoins(coinsFiltered.slice(0, slicedCoins.length));
  //     }
  //   };
  //   handleFilteredCoins();
  // }, [coins, slicedCoins, searchQuery, fetchMoreCoinsState]);

  return (
    <div className={styles.coins}>
      {filteredCoins.map(coin => (
        <Coin key={coin.id} coin={coins[coin.rank - 1]} />
      ))}
    </div>
  );
};

export default Coins;
