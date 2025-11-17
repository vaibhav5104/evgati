import React, { useState } from 'react';
import Pagination from './Pagination';
import { ChevronUp, ChevronDown } from 'lucide-react';

const Table = ({ 
  columns, 
  data, 
  onRowClick,
  className = '',
  itemsPerPage = 10,
  sortable = true,
  selectable = false,
  onSelectionChange
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  const sortedData = React.useMemo(() => {
    if (!sortable || !sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig, sortable]);

  const paginatedData = React.useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return sortedData.slice(firstPageIndex, lastPageIndex);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRowSelect = (rowId) => {
    const newSelectedRows = selectedRows.includes(rowId)
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId];

    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
  };

  const handleSelectAll = () => {
    const allRowIds = paginatedData.map(row => row.id);
    const newSelectedRows = 
      selectedRows.length === paginatedData.length 
        ? [] 
        : allRowIds;

    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
  };

  return (
    <div className={`${className}`}>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                {selectable && (
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => sortable && handleSort(column.key)}
                    className={`
                      px-6 py-4 
                      text-left text-xs 
                      font-semibold text-gray-700 
                      uppercase tracking-wider
                      ${sortable ? 'cursor-pointer select-none hover:bg-gray-200/50 active:bg-gray-300/50 transition-colors duration-150' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {sortable && (
                        <div className="flex flex-col">
                          <ChevronUp 
                            className={`w-3 h-3 -mb-1 transition-colors duration-200 ${
                              sortConfig.key === column.key && sortConfig.direction === 'ascending' 
                                ? 'text-blue-600' 
                                : 'text-gray-400'
                            }`}
                          />
                          <ChevronDown 
                            className={`w-3 h-3 transition-colors duration-200 ${
                              sortConfig.key === column.key && sortConfig.direction === 'descending' 
                                ? 'text-blue-600' 
                                : 'text-gray-400'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedData.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  onClick={() => onRowClick?.(row)}
                  className={`
                    transition-all duration-200 ease-in-out
                    ${onRowClick ? 'cursor-pointer hover:bg-blue-50/50 active:bg-blue-100/50' : 'hover:bg-gray-50/50'}
                    ${selectedRows.includes(row.id) ? 'bg-blue-50 hover:bg-blue-100/70' : ''}
                    ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                  `}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td 
                      key={column.key} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium"
                    >
                      {column.render 
                        ? column.render(row[column.key], row) 
                        : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedData.length === 0 && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No data available</h3>
            <p className="text-sm text-gray-500">There are no records to display at the moment.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {itemsPerPage < sortedData.length && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(sortedData.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Results Summary */}
      {sortedData.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
          <span className="font-semibold text-gray-900">
            {Math.min(currentPage * itemsPerPage, sortedData.length)}
          </span> of{' '}
          <span className="font-semibold text-gray-900">{sortedData.length}</span> results
        </div>
      )}
    </div>
  );
};

export default Table;