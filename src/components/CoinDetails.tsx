import { useParams } from 'react-router-dom';
import { cryptoAPI } from '../utils/crypto-api';
import useFetch from '../hooks/UseFetch';
import { ICryptoApiRes } from '../models/ICryptoApiRes';

const CoinDetails = () => {
  const { id } = useParams();

  const [data, loading, error] = useFetch(`${cryptoAPI}/${id}`);

  const coin = (data as ICryptoApiRes)?.coin;

  if (loading as boolean) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    if (error instanceof Error) {
      return <div>Error: {error.message}</div>;
    }
  }

  return (
    <>
      {coin && (
        <div>
          <h1>Symbol: {coin.symbol}</h1>
          <h1>Rank: {coin.rank}</h1>
          <h1>Price: {coin.price}</h1>
          <h1>Volume: {coin.volume}</h1>
          <h1>Market Cap: {coin.marketCap}</h1>
        </div>
      )}
    </>
  );
};

export default CoinDetails;
