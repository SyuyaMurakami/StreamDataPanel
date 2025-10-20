import './css/app.css'
import Panel from './component/panel/panel.jsx';
import Header from './component/header/header.jsx';
import { ThemeProvider } from './component/theme/theme.jsx';
import React, { useState, useEffect } from 'react';
import { ConfigProvider } from './component/config/ConfigContext.jsx'; 
import { loadConfig } from './component/eel/eel.jsx';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfig().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Loading Application Configuration... Please wait.</div>;
  }
  
  return (
    <ThemeProvider>
      <div className="app">
        <Panel>
          <Header />
        </Panel>
      </div>
    </ThemeProvider>
  )
}

export default App