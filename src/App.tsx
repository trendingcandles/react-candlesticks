import { useState } from 'react';
import SimpleChart from './examples/SimpleChart';
import VolumeChart from './examples/VolumeChart';
import IndicatorsChart from './examples/IndicatorsChart';
import CustomizationChart from './examples/CustomizationChart';
import FullConfigurationChart from './examples/FullConfigurationChart';
import MinimalChart from './examples/MinimalChart';
import NonInteractiveChart from './examples/NonInteractiveChart';

const examples = [
  'simple',
  'volume',
  'indicators',
  'customization',
  'full-configuration',
  'minimal',
  'non-interactive'
] as const;

function App() {

  const [ exampleChart, setExampleChart ] = useState<typeof examples[number]>('simple');

  return (
    <>
      <div
        style={{
          width: "96vw",
          height: "90vh",
          boxSizing: "border-box",
          padding: "48px 16px 48px 48px",
        }}
      >
        {exampleChart === "simple" && <SimpleChart />}
        {exampleChart === "volume" && <VolumeChart />}
        {exampleChart === "indicators" && <IndicatorsChart />}
        {exampleChart === "customization" && <CustomizationChart />}
        {exampleChart === "full-configuration" && <FullConfigurationChart />}
        {exampleChart === "minimal" && <MinimalChart />}
        {exampleChart === "non-interactive" && <NonInteractiveChart />}
      </div>
      <div
        style={{
          backgroundColor: "#272727",
          color: "white",
          padding: "16px",
          fontFamily: "sans-serif",
          display: "flex",
          gap: "24px",
        }}
      >
        {examples.map((example) => (
          <label key={example}>
            <input
              type="radio"
              value={example}
              checked={exampleChart === example}
              onChange={() => setExampleChart(example)}
            />
            {example}
          </label>
        ))}
      </div>
    </>
  );
}

export default App;
