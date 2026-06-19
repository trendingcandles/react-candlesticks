import { useState } from 'react';
import SimpleChart from './examples/SimpleChart';
import VolumeChart from './examples/VolumeChart';
import IndicatorsChart from './examples/IndicatorsChart';
import CustomizationChart from './examples/CustomizationChart';
import FullConfigurationChart from './examples/FullConfigurationChart';
import MinimalChart from './examples/MinimalChart';
import NonInteractiveChart from './examples/NonInteractiveChart';
import Indcators2Chart from './examples/Indcators2Chart';
import CustomLayerChart from './examples/CustomLayerChart';
import CustomDrawingChart from './examples/CustomDrawingChart';
import LayerInteractionChart from './examples/LayerInteractionChart';
import LayerInteractionChart2 from './examples/LayerInteractionChart2';

const examples = [
  'simple',
  'volume',
  'indicators',
  'indcators2',
  'custom-layer',
  'custom-drawing',
  'layer-interaction',
  'layer-interaction2',
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
        {exampleChart === "indcators2" && <Indcators2Chart />}
        {exampleChart === "custom-layer" && <CustomLayerChart />}
        {exampleChart === "custom-drawing" && <CustomDrawingChart />}
        {exampleChart === "layer-interaction" && <LayerInteractionChart />}
        {exampleChart === "layer-interaction2" && <LayerInteractionChart2 />}
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
          alignItems: "center",
          gap: "24px",
        }}
      >
        <label htmlFor="example-select">
          Example
        </label>
        <select
          id="example-select"
          value={exampleChart}
          onChange={(event) => setExampleChart(event.target.value as typeof examples[number])}
          style={{
            backgroundColor: "#1f1f1f",
            color: "white",
            border: "1px solid #555",
            borderRadius: "4px",
            padding: "6px 8px",
            font: "inherit",
          }}
        >
          {examples.map((example) => (
            <option key={example} value={example}>
              {example}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default App;
