import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './pages/RecipeList';
import RecipeForm from './components/RecipeForm'; 
import Navbar from './components/Navbar';
import './styles/global.css';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import RecipeEditForm from './components/RecipeEditForm';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/nova-receita" element={<RecipeForm />} />
          <Route path="/editar-receita/:id" element={<RecipeEditForm />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
