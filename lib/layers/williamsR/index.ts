import defineLayer from '../defineLayer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { WilliamsRLayerConfig, WilliamsRLayerConfigComplete } from './WilliamsRLayerConfig';
import hitTest from './hitTest';
import { onLayerElementClick, onLayerElementHover } from '../interactionHandlers';

export type { WilliamsRLayerConfig, WilliamsRLayerConfigComplete };

const williamsR = defineLayer<WilliamsRLayerConfig, WilliamsRLayerConfigComplete>({
  type: 'williams-r',
  displayName: 'WilliamsRLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
  hitTest,
  onHover: onLayerElementHover,
  onClick: onLayerElementClick,
});

export default williamsR;
