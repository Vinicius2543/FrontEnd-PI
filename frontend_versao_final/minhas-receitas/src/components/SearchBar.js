import React from 'react';
import styles from '../styles/global.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Pesquise o nome da receita"
      value={searchTerm}
      onChange={handleChange}
      className={styles.searchBar}
    />
  );
}

export default SearchBar;