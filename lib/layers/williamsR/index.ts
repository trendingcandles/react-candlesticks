import defineLayer from '../defineLayer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { WilliamsRLayerConfig, WilliamsRLayerConfigComplete } from './WilliamsRLayerConfig';

export type { WilliamsRLayerConfig, WilliamsRLayerConfigComplete };

const williamsR = defineLayer<WilliamsRLayerConfig, WilliamsRLayerConfigComplete>({
  type: 'williams-r',
  displayName: 'WilliamsRLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
});

export default williamsR;
