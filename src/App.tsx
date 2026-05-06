import React from 'react';
import './App.css';
import Dr from './components/Dr';
import { Web3Provider } from './providers/Web3Provider';

const App: React.FC = () => {
  return (
    <Web3Provider>
      <Dr />
    </Web3Provider>
  );
};

export default App;
