import Layer from '../../config/layer/Layer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { ObvLayerConfig, ObvLayerConfigComplete } from './ObvLayerConfig';

export type { ObvLayerConfig, ObvLayerConfigComplete };

const obv: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate: calc,
  draw,
};

export default obv;
