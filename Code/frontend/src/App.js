import React from 'react';
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'

import './App.css';

import Header from './components/template/Header.jsx'
import Nav from './components/template/Nav.jsx'
import Content from './components/template/Content.jsx'
import Footer from './components/template/Footer.jsx'

function App() {
  
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('userData') ? `bearer ${JSON.parse(localStorage.getItem('userData')).token}` : '';

  return (
    <BrowserRouter>
      <Header />
      <Nav />
      <Content />
      <Footer />
    </BrowserRouter>
  )
}

export default App;
