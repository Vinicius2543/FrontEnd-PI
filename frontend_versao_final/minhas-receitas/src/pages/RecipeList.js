import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/recipeList.module.css';
import { getAllRecipes, searchRecipes } from '../services/recipeFindItensService';
import { FaSearch } from 'react-icons/fa';

function RecipeList() {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const data = await getAllRecipes();
      setRecipes(data);
    }
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (search.trim() === '') {
      const all = await getAllRecipes();
      setRecipes(all);
    } else {
      const filtered = await searchRecipes(search);
      setRecipes(filtered);
    }
  };

  return (
    <div className={styles.recipeContainer}>
      <div className={styles.header}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Pesquise o nome da receita"
            className={styles.searchBar}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>

        <button className={styles.newRecipeButton} onClick={() => navigate('/nova-receita')}>
          + Nova Receita
        </button>
      </div>

      <div className={styles.recipeGrid}>
        {recipes.length === 0 ? (
          <p>Nenhuma receita encontrada.</p>
        ) : (
          recipes.map((recipe, index) => (
            <div
              className={styles.recipeCard}
              key={index}
              onClick={() => navigate(`/editar-receita/${recipe.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img src={`https://backend-pi-vr4v.onrender.com/imagens/${recipe.imagemUrl}`} alt="Receita" />
              <div className={styles.recipeInfo}>
                <span className={recipe.tipo === 'Próprio' ? styles.tagOwn : styles.tagTraditional}>
                  {recipe.tipo}
                </span>
                <h3>{recipe.nome}</h3>
                <p>{recipe.categoria}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecipeList;
