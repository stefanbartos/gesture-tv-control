import React from 'react';
import { Link } from "react-router-dom";
import './App.css';

const App = (): JSX.Element => (
  <div className="App">
  <h1>Delicate Fingers</h1>
  <nav>
    <Link to="/socket">Go to socket</Link>
    <br />
    <Link to="/video">Start Video</Link>
    <br />
    <Link to="/qr">Check QR</Link>
  </nav>
</div>
)

export default App;
