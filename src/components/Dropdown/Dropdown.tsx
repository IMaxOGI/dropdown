import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

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
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    const handleWindowBlur = () => {
      setIsOpen(false);
      setSearchQuery('');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
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
      setFilteredOptions(options.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [searchQuery, options, customSearch]);

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
