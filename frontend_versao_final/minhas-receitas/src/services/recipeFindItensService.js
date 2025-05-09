import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/receitas';

export const getAllRecipes = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const searchRecipes = async (keyword) => {
  const response = await axios.get(`${API_BASE_URL}/search/${keyword}`);
  return response.data;
};
