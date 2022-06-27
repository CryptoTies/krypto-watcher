import { useParams } from 'react-router-dom';
import { cryptoAPI } from '../utils/crypto-api';
import UseFetch from '../hooks/UseFetch';
import { IFetchedData } from '../models/IFetchedData';
import { ICoin } from '../models/ICoin';

const CoinDetails = () => {
  const params = useParams();
  const { id } = params;

  const {
    specificData: { data, loading, error },
  } = UseFetch(`${cryptoAPI}/${id}`);
  console.log(data);

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
      CoinDetails
      <h1>{(data as ICoin).symbol}</h1>
    </div>
  );
};

export default CoinDetails;
