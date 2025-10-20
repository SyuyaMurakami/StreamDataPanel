// src/component/theme/themeSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './theme.jsx';
import ThemeIcon from '../../asset/icon/theme.svg';

const ThemeSelector = () => {
  const { theme, changeTheme, allThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef(null);
  const themeListRef = useRef(null);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();

      const themeList = themeListRef.current;
      if (!themeList) return;

      // change scrollTop to scrollLeft so that it can handle horizental roll.
      themeList.scrollLeft += e.deltaY * 0.4 + e.deltaX;; 
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`control-icon-container theme-selector-container ${isOpen ? 'open' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="control-icon-button theme-toggle-button"
        style={{
          backgroundColor: theme?.['--primary-color'],
          color: theme?.['--text-color'],
        }}
      >
        <img 
          src={ThemeIcon} 
          alt="T" 
          className="control-icon-svg theme-icon-svg" 
        />
      </button>

      <div 
        ref={themeListRef}
        className={`theme-list ${isOpen ? 'open' : ''}`}
      >
        {Object.keys(allThemes).map((themeName) => (
          <button
            className="theme-select-button"
            key={themeName}
            onClick={() => changeTheme(themeName)}
            style={{
              backgroundColor: allThemes[themeName]?.['--primary-color'],
              color: allThemes[themeName]?.['--text-color'],
              borderColor: theme === allThemes[themeName] ? '#fff' : 'transparent',
            }}
          >
            {themeName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;