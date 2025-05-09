import axios from 'axios';

export async function salvarReceita(formData) {
  const response = await axios.post('http://localhost:8080/receitas/save', formData, {
    headers: {
    },
  });

  return response.data;
}
