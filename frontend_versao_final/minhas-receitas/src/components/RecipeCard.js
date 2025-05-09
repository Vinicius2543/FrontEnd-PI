import React from 'react';

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
    />
  );
}

export default SearchBar;