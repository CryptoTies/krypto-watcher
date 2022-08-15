import useFetch from '../hooks/UseFetch';
import { useParams } from 'react-router-dom';
import { cryptoAPI } from '../utils/crypto-api';
import { ICryptoApiRes } from '../models/ICryptoApiRes';
import { Helmet } from 'react-helmet';
import commaNumber from 'comma-number';
import styles from '../styles/CoinDetails.module.css';

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
          <div className={styles.coinDetails}>
            <div className={styles.rankContainer}>
              <h2>Rank: {coin.rank}</h2>
            </div>
            <div className={styles.symbolContainer}>
              <h2>Symbol: {coin.symbol}</h2>
            </div>
            <div className={styles.priceContainer}>
              <h2>Price: ${commaNumber(coin.price.toFixed(2))}</h2>
            </div>
            <div className={styles.volumeContainer}>
              <h2>Volume: ${commaNumber(coin.volume.toFixed(2))}</h2>
            </div>
            <div className={styles.marketCapContainer}>
              <h2>Market Cap: ${commaNumber(coin.marketCap.toFixed(2))}</h2>
            </div>
            <div className={styles.totalSupplyContainer}>
              <h2>Total Supply: ${commaNumber(coin.totalSupply.toFixed(2))}</h2>
            </div>
            <div className={styles.availableSupplyContainer}>
              <h2>
                Available Supply: $
                {commaNumber(coin.availableSupply.toFixed(2))}
              </h2>
            </div>
            {coin.websiteUrl && (
              <div className={styles.webSiteContainer}>
                <h2>
                  Official Site:{' '}
                  <a href={coin.websiteUrl} target='_blank' rel='noreferrer'>
                    {coin.websiteUrl}
                  </a>
                </h2>
              </div>
            )}
            {coin.twitterUrl && (
              <div className={styles.twitterContainer}>
                <h2>
                  Twitter:{' '}
                  <a href={coin.twitterUrl} target='_blank' rel='noreferrer'>
                    {coin.twitterUrl}
                  </a>
                </h2>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CoinDetails;
