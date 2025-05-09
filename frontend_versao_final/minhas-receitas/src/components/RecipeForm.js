import React, { useState } from 'react';
import styles from '../styles/recipeForm.module.css';
import { useNavigate } from 'react-router-dom';
import { salvarReceita } from '../services/recipeSaveService';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';


function RecipeForm({ onAddRecipe }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepMethod, setPrepMethod] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [category, setCategory] = useState('');
  const [recipeType, setRecipeType] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState(['']);
  const navigate = useNavigate();

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleRecipeTypeChange = (e) => {
    setRecipeType(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // preview
      setImageFile(file); // para enviar pro backend
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = async () => {
    const receita = {
      nome: title,
      ingredientes: ingredients.join(', '),
      descricao: description,
      modoPreparo: prepMethod,
      tempoPreparo: parseInt(prepTime, 10),
      categoria: category,
      tipo: recipeType,
      imagemUrl: ""
    };

    const formData = new FormData();

    //Criação do Blob de forma segura
    const receitaBlob = new Blob(
      [JSON.stringify(receita)],
      { type: "application/json" }
    );

    formData.append("recipe", receitaBlob);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await salvarReceita(formData);
      toast.success("Receita cadastrada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar receita!");
    }
  };



  return (
    <>
      {/* Container para Receita */}
      <div className={styles.recipeContainer}>
        <h1>Receita</h1>

        <div className={styles.formRow}>
          {/* Coluna Esquerda */}
          <div className={styles.leftColumn}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.inputWrapperDescription}>
              <input
                type="text"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                placeholder="Tempo de Preparo (min)"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Categoria"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.recipeTypeLabel}>Tipo de Receita</label>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    value="própria"
                    checked={recipeType === 'própria'}
                    onChange={handleRecipeTypeChange}
                  />
                  Própria
                </label>
                <label>
                  <input
                    type="radio"
                    value="tradicional"
                    checked={recipeType === 'tradicional'}
                    onChange={handleRecipeTypeChange}
                  />
                  Tradicional
                </label>
              </div>
            </div>
          </div>

          {/* Coluna Direita (Upload de Imagem) */}
          <div className={styles.rightColumn}>
            <div className={styles.imageUploadContainer}>
              <div className={styles.imagePreviewWrapper}>
                {image ? (
                  <img src={image} alt="Preview" className={styles.imagePreview} />
                ) : (
                  <span className={styles.placeholderText}>Imagem aqui</span>
                )}
              </div>
              <input
                className={styles.inputWrapper}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.ingreCardContainer}>
        <h2>Ingredientes</h2>
        {ingredients.map((ingredient, index) => (
          <div key={index} className={styles.ingredientRow}>
            <input
              type="text"
              placeholder="Ingrediente"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className={styles.ingredientInput}
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => handleRemoveIngredient(index)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button type="button" className={styles.addButton} onClick={handleAddIngredient}>
          <FaPlus /> Adicionar Ingrediente
        </button>
      </div>

      {/* Card para Modo de Preparo fora do container da receita */}
      <div className={styles.prepCardContainer}>
        <h2>Modo de Preparo</h2>
        <div className={styles.inputWrapperPrepareMode}>
          <input
            type="text"
            placeholder="Digite aqui o modo de preparo"
            value={prepMethod}
            onChange={(e) => setPrepMethod(e.target.value)}
          />
        </div>
        {/* Adicione os campos de Modo de Preparo aqui */}
      </div>

      {/* Botão fora do container da receita */}
      <div className={styles.buttonContainer}>
        <button className={styles.backButton} onClick={handleBack}>
          Voltar
        </button>
        <button className={styles.submitButton} type="button" onClick={handleSubmit}>
          Adicionar Receita
        </button>
      </div>
    </>
  );
}

export default RecipeForm;
