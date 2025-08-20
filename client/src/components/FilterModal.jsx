import { useState } from 'react';
import './FilterModal.css';

export default function FilterModal({ filterMeta, currentFilters, onApply, onClose }) {
  const [filters, setFilters] = useState(currentFilters);

  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value ? Number(value) : ''
    }));
  };

  const handleColorChange = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors?.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...(prev.colors || []), color]
    }));
  };

  const handleSizeChange = (size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...(prev.sizes || []), size]
    }));
  };

  const handleSortChange = (sort) => {
    setFilters(prev => ({
      ...prev,
      sort: prev.sort === sort ? '' : sort
    }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    setFilters({});
  };

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={e => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h3>Filters</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="filter-sections">
          {/* Price Range */}
          <div className="filter-section">
            <h4>Price Range (₹)</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Colors */}
          {filterMeta.colors && filterMeta.colors.length > 0 && (
            <div className="filter-section">
              <h4>Colors</h4>
              <div className="color-options">
                {filterMeta.colors.map(color => (
                  <label key={color} className="color-option">
                    <input
                      type="checkbox"
                      checked={filters.colors?.includes(color) || false}
                      onChange={() => handleColorChange(color)}
                    />
                    <span className="color-dot" style={{backgroundColor: color.toLowerCase()}}></span>
                    {color}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {filterMeta.sizes && filterMeta.sizes.length > 0 && (
            <div className="filter-section">
              <h4>Sizes</h4>
              <div className="size-options">
                {filterMeta.sizes.map(size => (
                  <label key={size} className="size-option">
                    <input
                      type="checkbox"
                      checked={filters.sizes?.includes(size) || false}
                      onChange={() => handleSizeChange(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sort */}
          <div className="filter-section">
            <h4>Sort By</h4>
            <div className="sort-options">
              <label className="sort-option">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sort === 'price-low'}
                  onChange={() => handleSortChange('price-low')}
                />
                Price: Low to High
              </label>
              <label className="sort-option">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sort === 'price-high'}
                  onChange={() => handleSortChange('price-high')}
                />
                Price: High to Low
              </label>
              <label className="sort-option">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sort === 'newest'}
                  onChange={() => handleSortChange('newest')}
                />
                Newest First
              </label>
            </div>
          </div>
        </div>

        <div className="filter-modal-actions">
          <button className="clear-btn" onClick={handleClear}>
            Clear All
          </button>
          <button className="apply-btn" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}