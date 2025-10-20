import { useRef, useCallback } from 'react';

/**
 * Encapsulates the configuration (import/export) logic for the Panel.
 * @param {{
 * panelTitle: string,
 * setPanelTitle: Function,
 * currentThemeName: string,
 * allThemes: Object,
 * changeTheme: Function,
 * charts: Array,
 * layouts: Object,
 * setLayouts: Function,
 * addChart: Function,
 * removeChart: Function,
 * chartRefs: React.MutableRefObject<Map<string, any>>,
 * setIsImporting: Function,
 * isImporting: boolean,
 * }} coreProps - Properties passed from usePanelCore and useTheme
 * @returns {{
 * importInputRef: React.MutableRefObject<HTMLInputElement | null>,
 * triggerImport: Function,
 * exportLayout: Function,
 * importLayout: Function,
 * }}
 */
const useConfigIO = ({
    panelTitle,
    setPanelTitle,
    currentThemeName,
    allThemes,
    changeTheme,
    charts,
    layouts,
    setLayouts,
    addChart,
    removeChart,
    chartRefs,
    setIsImporting,
    isImporting,
}) => {
    // Reference to the hidden file input element for import
    const importInputRef = useRef(null);

    // Triggers the click event on the hidden file input element
    const triggerImport = useCallback(() => {
        if (importInputRef.current && !isImporting) {
            importInputRef.current.click();
        }
    }, [isImporting]);

    // Exports the current panel layout and configuration to a JSON file
    const exportLayout = useCallback(() => {
        // Data structure for the exported layout
        const layoutData = {
            title: panelTitle,
            themeName: currentThemeName,
            charts: charts.map(chart => ({
                chartType: chart.chartType,
                keyWord: chart.keyWord,
            })),
            layouts: layouts,
        };

        // Create a downloadable JSON file
        const jsonString = JSON.stringify(layoutData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary anchor element for download
        const a = document.createElement('a');
        a.href = url;
        // Generate a filename based on the current timestamp
        a.download = `panel_layout_${new Date().toISOString().slice(0, 19).replace('T', '_')}.json`;
        
        // Trigger the download
        document.body.appendChild(a);
        a.click();
        
        // Clean up the temporary elements and URL
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [panelTitle, currentThemeName, charts, layouts]);

    // Imports the panel layout from a selected JSON file
    const importLayout = useCallback(async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            setIsImporting(true);
            const newIdMap = []; // To map old layout IDs to new chart IDs

            try {
                const importedData = JSON.parse(e.target.result);
                const {
                    title: importedTitle,
                    themeName: importedThemeName,
                    charts: importedCharts,
                    layouts: importedLayouts
                } = importedData;

                // Set Title and Theme
                if (importedTitle) setPanelTitle(importedTitle);
                if (importedThemeName && allThemes[importedThemeName]) {
                    changeTheme(importedThemeName);
                } else if (importedThemeName) {
                    console.warn(`Theme "${importedThemeName}" not found. Keeping current theme.`);
                }

                if (!importedCharts || !importedLayouts) {
                    throw new Error("Invalid file format. Missing charts or layouts.");
                }

                // Force Cleanup of old state (must wait)
                // First, remove all existing connections and charts
                charts.forEach(chart => removeChart(chart.id));
                // Clear the layouts state
                setLayouts({ lg: [], md: [], sm: [], xs: [], xxs: [] });
                // Ensure state updates are committed before proceeding (using a microtask delay)
                await new Promise(resolve => setTimeout(resolve, 0));

                // Loop through and import charts, waiting for new IDs
                // (addChart handles connection and Chart state internally)
                for (let i = 0; i < importedCharts.length; i++) {
                    const chart = importedCharts[i];
                    try {
                        const newId = await addChart(chart.chartType, chart.keyWord);
                        // Store mapping: old layout item ID (i) -> new chart ID
                        newIdMap.push({ oldI: importedLayouts.lg[i]?.i || `temp-old-id-${i}`, newI: newId });
                    } catch (error) {
                        console.error(`Failed to subscribe to chart ${chart.keyWord}:`, error);
                    }
                }

                // Delay to allow all chart subscriptions and initial data fetch to complete
                await new Promise(resolve => setTimeout(resolve, 300));

                // Overwrite layouts using the mapped IDs
                if (newIdMap.length > 0) {
                    const finalLayouts = { ...importedLayouts };
                    // Create a quick lookup map for ID translation
                    const idMapper = new Map(newIdMap.map(item => [item.oldI, item.newI]));

                    for (const breakpoint in finalLayouts) {
                        if (finalLayouts[breakpoint]) {
                            finalLayouts[breakpoint] = finalLayouts[breakpoint]
                                // Only keep layout items for charts that were successfully imported
                                .filter(item => idMapper.has(item.i))
                                // Update the layout item ID (i) with the new chart ID
                                .map(item => ({ ...item, i: idMapper.get(item.i) }));
                        }
                    }

                    // Set the correct layouts state in one go
                    setLayouts(finalLayouts);
                    await new Promise(resolve => setTimeout(resolve, 50)); // Ensure layout is applied

                    // Force resize all ECharts instances (to fix potential size issues caused by grid layout)
                    chartRefs.current.forEach(instance => {
                        try {
                            instance.resize();
                        } catch (e) {
                            console.error("ECharts resize failed:", e);
                        }
                    });

                    console.log("Panel layout imported, positioned, and charts resized successfully.");
                } else {
                    console.log("No charts were successfully imported/subscribed.");
                }

            } catch (error) {
                console.error("Error importing layout file:", error);
                // Alert user about the failure
                alert("Import layout file failed: " + error.message);
            } finally {
                setIsImporting(false);
                event.target.value = null; // Clear file input value to allow re-selection of the same file
            }
        };
        reader.readAsText(file);
    }, [
        charts, removeChart, setLayouts, addChart,
        setPanelTitle, changeTheme, allThemes,
        chartRefs, setIsImporting
    ]);

    return {
        importInputRef,
        triggerImport,
        exportLayout,
        importLayout,
    };
};

export default useConfigIO;