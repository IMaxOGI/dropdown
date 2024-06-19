import React from 'react';
import './App.css';
import Dropdown from './components/Dropdown/Dropdown';

const options = ['Item 1', 'Item 2', 'Item 3'];
const options2 = ['Item 1', 'Item 2', 'Item 3'];

const App: React.FC = () => {
  return (
    <div className="App">
      <Dropdown
        title="Choose Options"
        options={options}
        customSearch={async (query) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
        }}
        renderSelectedOption={(selectedOption) => <div style={{ color: 'black' }}>{selectedOption}</div>}
        renderOption={(option) => <div style={{ color: 'black' }}>{option}</div>}
      />
      <Dropdown
        options={options2}
        customSearch={async (query) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return options2.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
        }}
        renderSelectedOption={(selectedOption) => <div style={{ color: 'blue' }}>{selectedOption}</div>}
        renderOption={(option) => <div style={{ color: 'blue' }}>{option}</div>}
      />
    </div>
  );
};

export default App;
