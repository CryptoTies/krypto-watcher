import { useParams } from 'react-router-dom';

const CoinDetails = () => {
  const params = useParams();
  const { id } = params;

  return (
    <div>
      CoinDetails
      <h1>Id: {id} </h1>
    </div>
  );
};

export default CoinDetails;
