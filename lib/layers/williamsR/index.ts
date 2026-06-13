import Layer from '../../config/layer/Layer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { WilliamsRLayerConfig, WilliamsRLayerConfigComplete } from './WilliamsRLayerConfig';

export type { WilliamsRLayerConfig, WilliamsRLayerConfigComplete };

const williamsR: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate2: calc,
  draw,
};

export default williamsR;
