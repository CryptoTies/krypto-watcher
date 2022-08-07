import React, { forwardRef } from 'react';
import styles from '../styles/SearchBar.module.css';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  return (
    <form className={styles.searchBar}>
      <input
        className={styles.searchBar__input}
        type='text'
        placeholder='Search Coin...'
        ref={ref}
        {...props}
      />
      <button className={styles.searchBar__btn} type='button'>
        <i className='fas fa-search'></i>
      </button>
    </form>
  );
});

export default SearchBar;
