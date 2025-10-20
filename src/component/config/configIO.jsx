// src/component/config/configIO.jsx
import React, { useState } from 'react';

// Import custom hooks
import { useConfigContext } from '../config/ConfigContext.jsx'; 
import { useTheme } from '../theme/theme.jsx';
// Import icons
import DownloadIcon from '../../asset/icon/download.svg';
import ImportIcon from '../../asset/icon/import.svg';
import UploadIcon from '../../asset/icon/upload.svg';

const ConfigIO = () => {
    const { theme, changeTheme, allThemes } = useTheme();
    
    // State for hover effect on Save/Export button group
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    // State for hover effect on Load/Import button group
    const [isLoadOpen, setIsLoadOpen] = useState(false);
    
    const handleMouseEnterSave = () => setIsSaveOpen(true);
    const handleMouseLeaveSave = () => setIsSaveOpen(false);
    const handleMouseEnterLoad = () => setIsLoadOpen(true);
    const handleMouseLeaveLoad = () => setIsLoadOpen(false);
    
    // Use Context to get all IO functionalities and status
    const { 
        exportLayout, 
        importLayout, 
        triggerImport, 
        importInputRef, 
        isImporting 
    } = useConfigContext();

    return (
        <div className="control-icon-group config-io-group">
            <div 
                className={`control-icon-container config-io-container ${isSaveOpen ? 'open' : ''}`}
                onMouseEnter={handleMouseEnterSave}
                onMouseLeave={handleMouseLeaveSave}
            >
                {/* Export Button */}
                <button 
                    className={`control-icon-button config-io-button ${isSaveOpen ? 'open' : ''}`}
                    onClick={exportLayout}
                    disabled={isImporting} // Disable during import process
                >
                    <img 
                        src={DownloadIcon} 
                        alt="S" 
                        className="control-icon-svg config-icon-svg download" 
                    />
                </button>
            </div>
            <div 
                className={`control-icon-container config-io-container ${isLoadOpen ? 'open' : ''}`}
                onMouseEnter={handleMouseEnterLoad}
                onMouseLeave={handleMouseLeaveLoad}
            >
                {/* Import Button: Triggers a click on the hidden input element */}
                <button 
                    className={`control-icon-button config-io-button ${isLoadOpen ? 'open' : ''}`}
                    onClick={triggerImport}
                    disabled={isImporting} // Disable if an import is already in progress
                >
                    {isImporting ? (
                        // Display spinning or dynamic icon when importing
                        <img 
                            src={ImportIcon} 
                            alt=":" 
                            className="control-icon-svg config-icon-svg import" 
                        />
                    ) : (
                        // Display the standard upload/import icon
                        <img 
                            src={UploadIcon} 
                            alt="L" 
                            className="control-icon-svg config-icon-svg upload" 
                        />     
                    )}
                </button>

                {/* Hidden file input box, used to handle actual file selection */}
                <input
                    type="file"
                    id="import-layout"
                    ref={importInputRef} 
                    className="import-file"
                    accept=".json" // Restrict to JSON files
                    onChange={importLayout} // Call the importLayout function when file changes
                    style={{ display: 'none' }} // Hide the input element
                    disabled={isImporting}
                />
            </div>
        </div>
    );
};

export default ConfigIO;