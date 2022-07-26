import { COIN_FILTER_OPTIONS } from '../models/CoinFilterOptions';

interface Props {
  handleFilterOptionsChange: (filterState: string) => void;
}

const CoinFilterOptions = ({ handleFilterOptionsChange }: Props) => {
  return (
    <div>
      <label htmlFor='coins'>Filter by: </label>
      <select
        value={COIN_FILTER_OPTIONS[0][0]}
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
