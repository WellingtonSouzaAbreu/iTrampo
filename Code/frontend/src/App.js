import React from 'react';
import { BrowserRouter } from 'react-router-dom'

import './App.css';

import Header from './components/template/Header.jsx'
import Nav from './components/template/Nav.jsx'
import Content from './components/template/Content.jsx'
import Footer from './components/template/Footer.jsx'

function App() {
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
