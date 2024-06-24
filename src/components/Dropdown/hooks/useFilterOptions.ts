import { useState, useEffect } from 'react';

const useFilterOptions = (
  options: string[],
  searchQuery: string,
  customSearch?: (query: string) => Promise<string[]> | string[],
) => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);

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

  return filteredOptions;
};

export default useFilterOptions;
