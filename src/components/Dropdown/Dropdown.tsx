import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

interface DropdownProps {
  options: string[];
  customSearch?: (query: string) => Promise<string[]> | string[];
  renderOption?: (option: string) => React.ReactNode;
  renderSelectedOption?: (selectedOption: string) => React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ options, customSearch, renderOption, renderSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (customSearch) {
      const result = customSearch(searchQuery);
      if (result instanceof Promise) {
        result.then(setFilteredOptions);
      } else {
        setFilteredOptions(result);
      }
    } else {
      setFilteredOptions(
        options.filter(option => option.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  }, [searchQuery, options, customSearch]);

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div
        className={`dropdown-header ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
        tabIndex={0}
      >
        {selectedOption
          ? renderSelectedOption
            ? renderSelectedOption(selectedOption)
            : selectedOption
          : 'Выберите опцию'}
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </div>
      {isOpen && (
        <div className="dropdown-body">
          <input
            type="text"
            className="dropdown-search"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <ul className="dropdown-options">
            {filteredOptions.map(option => (
              <li
                key={option}
                className="dropdown-option"
                onClick={() => handleOptionClick(option)}
              >
                {renderOption ? renderOption(option) : option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;