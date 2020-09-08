import React from 'react';
import './App.css';

import Header from './components/template/Header.jsx'
import Nav from './components/template/Nav.jsx'
import Content from './components/template/Content.jsx'
import Footer from './components/template/Footer.jsx'

function App() {
  return (
    <React.Fragment>
      <Header />
      <Nav/>
      <Content />
      <Footer/>
    </React.Fragment>
  )
}

export default App;
