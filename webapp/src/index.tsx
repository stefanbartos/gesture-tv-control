import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Video from './Video';
import App from './App';
import QRScreen from './QR-reader';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/video' element={<Video />} />
      <Route path='/qr' element={<QRScreen />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
