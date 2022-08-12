import useFetch from '../hooks/UseFetch';
import { useParams } from 'react-router-dom';
import { cryptoAPI } from '../utils/crypto-api';
import { ICryptoApiRes } from '../models/ICryptoApiRes';
import { Helmet } from 'react-helmet';

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
        <>
          <Helmet>
            <title>{coin.name} | Kyrpto Watcher</title>
          </Helmet>
          <div>
            <h1>Rank: {coin.rank}</h1>
            <h1>Symbol: {coin.symbol}</h1>
            <h1>Price: {coin.price}</h1>
            <h1>Volume: {coin.volume}</h1>
            <h1>Market Cap: {coin.marketCap}</h1>
            <h1>Total Supply: {coin.totalSupply}</h1>
            <h1>Available Supply: {coin.availableSupply}</h1>
            <h1>
              Official Site:{' '}
              <a href={coin.websiteUrl} target='_blank' rel='noreferrer'>
                {coin.websiteUrl}
              </a>
            </h1>
            <h1>
              Twitter:{' '}
              <a href={coin.twitterUrl} target='_blank' rel='noreferrer'>
                {coin.twitterUrl}
              </a>
            </h1>
          </div>
        </>
      )}
    </>
  );
};

export default CoinDetails;
