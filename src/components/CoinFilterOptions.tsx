import { COIN_FILTER_OPTIONS } from '../models/CoinFilterOptions';

interface Props {
  handleFilterOptionsChange: (filterState: string) => void;
  coinOptionsState: string;
}

const CoinFilterOptions = ({
  handleFilterOptionsChange,
  coinOptionsState,
}: Props) => {
  return (
    <div>
      <label htmlFor='coins'>Filter by: </label>
      <select
        value={coinOptionsState}
        id='coins'
        name='coins'
        onChange={e => handleFilterOptionsChange(e.target.value)}
      >
        {COIN_FILTER_OPTIONS.map((option, idx) => (
          <option key={idx} value={option[0]}>
            {option[1]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CoinFilterOptions;
