import React, { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search...', 
  className = '',
  debounceTime = 300 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce((term) => {
    onSearch(term);
  }, debounceTime);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full ${className}`}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg 
          className="h-5 w-5 text-gray-400" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="
          block w-full pl-10 pr-3 py-2 
          border border-gray-300 rounded-md 
          leading-5 bg-white 
          placeholder-gray-500 text-gray-900 
          focus:outline-none focus:placeholder-gray-400 
          focus:border-blue-300 focus:ring focus:ring-blue-200 
          transition duration-150 ease-in-out 
          sm:text-sm
        "
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            onSearch('');
          }}
          className="
            absolute inset-y-0 right-0 pr-3 
            flex items-center 
            text-gray-400 hover:text-gray-600
          "
        >
          <svg 
            className="h-5 w-5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      )}
    </form>
  );
};

export default SearchBar;

