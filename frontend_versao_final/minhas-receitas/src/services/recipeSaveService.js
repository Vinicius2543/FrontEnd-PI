import axios from 'axios';

export async function salvarReceita(formData) {
  const response = await axios.post('https://backend-pi-vr4v.onrender.com/receitas/save', formData, {
    headers: {
    },
  });

  return response.data;
}
