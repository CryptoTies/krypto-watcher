import React, { forwardRef } from 'react';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  return (
    <form>
      <input type='text' placeholder='Search Coin...' ref={ref} {...props} />
    </form>
  );
});

export default SearchBar;
