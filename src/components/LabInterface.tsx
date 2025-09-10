import Header from "./Header";
import ConfigurationPanel from "./ConfigurationPanel";
import ResultsCanvas from "./ResultsCanvas";
import HistoryPanel from "./HistoryPanel";

const LabInterface = () => {
  return (
    <div className="min-h-screen bg-lab-background font-roboto">
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Configuration Panel - 45% width */}
        <div className="w-[45%] min-w-0">
          <ConfigurationPanel />
        </div>
        
        {/* Results Canvas - 45% width */}
        <div className="w-[45%] min-w-0">
          <ResultsCanvas />
        </div>
        
        {/* History Panel - 10% width, collapsible */}
        <div className="w-[10%] min-w-0 max-w-80">
          <HistoryPanel />
        </div>
      </div>
    </div>
  );
};

export default LabInterface;