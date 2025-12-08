import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Hidden Treasures Network</h1>
          <p>Discover and share hidden treasures in your community</p>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home">
      <h2>Welcome to Hidden Treasures Network</h2>
      <p>Start exploring...</p>
    </div>
  );
}

export default App;
