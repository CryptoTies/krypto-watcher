import { useEffect, useMemo } from 'react';
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
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      handleFetchMoreCoinsState(false);
    } else {
      handleFetchMoreCoinsState(true);
    }
  }, [searchQuery, handleFetchMoreCoinsState]);

  const memoFilteredCoins = useMemo(() => {
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
      return coinsFiltered;
    } else {
      return coinsFiltered.slice(0, slicedCoins.length);
    }
  }, [coinOptionsState, searchQuery, coins, slicedCoins, fetchMoreCoinsState]);

  return (
    <ul className={styles.coins}>
      {memoFilteredCoins.map(coin => (
        <Coin key={coin.id} coin={coins[coin.rank - 1]} />
      ))}
    </ul>
  );
};

export default Coins;
