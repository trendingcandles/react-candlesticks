import defineLayer from '../defineLayer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { CciLayerConfig, CciLayerConfigComplete } from './CciLayerConfig';
import hitTest from './hitTest';
import { onLayerElementClick, onLayerElementHover } from '../interactionHandlers';

export type { CciLayerConfig, CciLayerConfigComplete };

const cci = defineLayer<CciLayerConfig, CciLayerConfigComplete>({
  type: 'cci',
  displayName: 'CCILayer',
  parseConfig: parse,
  calculate: calc,
  draw,
  hitTest,
  onHover: onLayerElementHover,
  onClick: onLayerElementClick,
});

export default cci;
