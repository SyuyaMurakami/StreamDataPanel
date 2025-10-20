// src/component/header/header.jsx
import ThemeSelector from '../theme/themeSelector.jsx';
import Title from './headerTitle.jsx';
import ConfigIO from '../config/configIO.jsx'; 

const Header = () => {

  return (
    <div className="header-row">
      <ThemeSelector />
      <Title />
      <ConfigIO /> 
    </div>
  );
};

export default Header;