import React from 'react';
import './App.css';
import Dropdown from './components/Dropdown/Dropdown';

const options = ['Item 1', 'Item 2', 'Item 3'];

const App: React.FC = () => {
  return (
    <div className="App">
      <Dropdown
        options={options}
        customSearch={async query => {
          await new Promise(resolve => setTimeout(resolve, 500));
          return options.filter(option => option.toLowerCase().includes(query.toLowerCase()));
        }}
      />
    </div>
  );
};

export default App;
