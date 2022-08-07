import { COIN_FILTER_OPTIONS } from '../models/CoinFilterOptions';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from '../styles/CoinFilterOptions.module.css';

interface Props {
  handleFilterOptionsChange: (filterState: string) => void;
  coinOptionsState: string;
}

const CoinFilterOptions = ({
  handleFilterOptionsChange,
  coinOptionsState,
}: Props) => {
  return (
    <Box>
      <FormControl className={styles.coinFilter__bar}>
        <InputLabel htmlFor='coins'>Filter by: </InputLabel>
        <Select
          labelId='coins'
          label='Filter by: '
          id='coins'
          name='coins'
          value={coinOptionsState}
          onChange={(e: SelectChangeEvent) =>
            handleFilterOptionsChange(e.target.value)
          }
        >
          {COIN_FILTER_OPTIONS.map((option, idx) => (
            <MenuItem key={idx} value={option[0]}>
              {option[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CoinFilterOptions;
