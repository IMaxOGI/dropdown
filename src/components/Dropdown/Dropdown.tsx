import React, { useState, useRef } from 'react';
import './Dropdown.css';
import useOutsideClick from './hooks/useOutsideClick';
import useVisibilityChange from './hooks/useVisibilityChange';
import useFilterOptions from './hooks/useFilterOptions';

interface DropdownProps {
  options: string[];
  title?: string;
  customSearch?: (query: string) => Promise<string[]> | string[];
  renderOption?: (option: string) => React.ReactNode;
  renderSelectedOption?: (selectedOption: string) => React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ options, title, customSearch, renderOption, renderSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => {
    setIsOpen(false);
    setSearchQuery('');
  });

  useVisibilityChange(() => {
    setIsOpen(false);
    setSearchQuery('');
  });

  const filteredOptions = useFilterOptions(options, searchQuery, customSearch);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setSearchQuery('');
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
    >
      <div
        className={`dropdown-header ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
        tabIndex={0}
      >
        {selectedOption
          ? renderSelectedOption
            ? renderSelectedOption(selectedOption)
            : selectedOption
          : title || 'Оберіть ваше місто'}
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </div>
      {isOpen && (
        <div className="dropdown-body">
          <input
            type="text"
            className="dropdown-search"
            placeholder="Пошук..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul className="dropdown-options">
            {filteredOptions.map((option) => (
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
