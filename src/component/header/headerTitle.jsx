// src/component/header/headerTitle.jsx
import React, { useState } from 'react';
import { useConfigContext } from '../config/configContext.jsx'; 

const Title = () => {
  const { panelTitle, setPanelTitle } = useConfigContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    setPanelTitle(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };
  return (
    <header className="header-title">
      {isEditing ? (
        <input
          id="header-input"
          className="header-input"
          type="text"
          value={panelTitle} 
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
      ) : (
        <h1 className="header-h1" onDoubleClick={handleTitleClick}>
          {panelTitle || 'Input New Title'}
        </h1>
      )}
    </header>
  );
};

export default Title;
