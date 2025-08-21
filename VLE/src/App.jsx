import React from 'react';
import Register from './register';
import Login from './login';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
function App() {
  return (
   <BrowserRouter>
    
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;