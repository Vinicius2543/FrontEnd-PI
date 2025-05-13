import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarReceita, atualizarReceita, deletarReceita } from '../services/recipeEditService';
import styles from '../styles/recipeForm.module.css';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


function RecipeEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados da receita
  const [receita, setReceita] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepMethod, setPrepMethod] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [category, setCategory] = useState('');
  const [recipeType, setRecipeType] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState(['']);

  // Carrega receita
  useEffect(() => {
    async function carregarReceita() {
      try {
        const dados = await buscarReceita(id);
        setReceita(dados);
        setTitle(dados.nome || '');
        setDescription(dados.descricao || '');
        setPrepMethod(dados.modoPreparo || '');
        setPrepTime(dados.tempoPreparo || '');
        setCategory(dados.categoria || '');
        setRecipeType(dados.tipo || '');
        setIngredients(dados.ingredientes ? dados.ingredientes.split(', ') : ['']);
        setImage(dados.imagemUrl || null);
      } catch (e) {
        toast.error('Erro ao carregar receita');
        navigate('/');
      }
    }

    carregarReceita();
  }, [id, navigate]);

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
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleDeleteRecipe = () => {
    if (!receita?.id) return;

    confirmAlert({
      title: 'Remover receita',
      message: 'Tem certeza que deseja deletar esta receita?',
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            try {
              await deletarReceita(receita.id);
              toast.success('Receita deletada com sucesso!');
              setTimeout(() => {
                navigate('/');
                window.location.reload();
              }, 2000);

            } catch (e) {
              toast.error('Erro ao deletar receita');
            }
          }
        },
        {
          label: 'Cancelar',
          onClick: () => { }
        }
      ]
    });
  };

  const handleSubmit = async () => {
    const receitaAtualizada = {
      id: receita.id,
      nome: title,
      ingredientes: ingredients.join(', '),
      descricao: description,
      modoPreparo: prepMethod,
      tempoPreparo: parseInt(prepTime, 10),
      categoria: category,
      tipo: recipeType,
      imagemUrl: receita.imagemUrl
    };

    const formData = new FormData();
    const receitaBlob = new Blob([JSON.stringify(receitaAtualizada)], { type: 'application/json' });
    formData.append('recipe', receitaBlob);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await atualizarReceita(receita.id, formData);
      toast.success('Receita atualizada com sucesso!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar receita!');
    }
  };

  return (
    <>
      <div className={styles.recipeContainer}>
        <h1>Editar Receita</h1>

        <div className={styles.formRow}>
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

          <div className={styles.rightColumn}>
            <div className={styles.imageUploadContainer}>
              <div className={styles.imagePreviewWrapper}>
                <img
                  src={
                    typeof image === 'string' && !image.startsWith('blob')
                      ? `https://backend-pi-vr4v.onrender.com/${image}`
                      : image
                  }
                  alt="Preview"
                  className={styles.imagePreview}
                />
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
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.backButton} onClick={handleBack}>
          Voltar
        </button>
        <button className={styles.submitButton} type="button" onClick={handleSubmit}>
          Salvar Alterações
        </button>
        <button className={styles.deleteButton} type="button" onClick={handleDeleteRecipe}>
          <FaTrash />
        </button>
      </div>
    </>
  );
}

export default RecipeEditForm;
