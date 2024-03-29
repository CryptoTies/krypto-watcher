import React, { forwardRef } from 'react';
import styles from '../styles/SearchBar.module.css';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}

const SearchBar = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  return (
    <div
      className={
        props.className
          ? `${styles.searchBar} ${styles[props.className]}`
          : `${styles.searchBar}`
      }
    >
      <form className={styles.searchBar__form}>
        <input
          className={styles.searchBar__input}
          type='text'
          ref={ref}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        />
        <button className={styles.searchBar__btn} type='button'>
          <i className='fas fa-search'></i>
        </button>
      </form>
    </div>
  );
});

export default SearchBar;
