import { useParams } from 'react-router-dom';
import { cryptoAPI } from '../utils/crypto-api';
import UseFetch from '../hooks/UseFetch';
import { ICoin } from '../models/ICoin';

const CoinDetails = () => {
  const params = useParams();
  const { id } = params;

  const {
    specificData: { data, loading, error },
  } = UseFetch(`${cryptoAPI}/${id}`);

  const coin = data as ICoin;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    if (error instanceof Error) {
      return <div>Error: {error.message}</div>;
    }
  }

  return (
    <div>
      <h1>Symbol: {coin.symbol}</h1>
      <h1>Rank: {coin.rank}</h1>
      <h1>Price: {coin.price}</h1>
      <h1>Volume: {coin.volume}</h1>
      <h1>Market Cap: {coin.marketCap}</h1>
    </div>
  );
};

export default CoinDetails;
