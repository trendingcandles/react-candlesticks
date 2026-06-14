import Layer from '../../config/layer/Layer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { ParabolicSarLayerConfig, ParabolicSarLayerConfigComplete } from './ParabolicSarLayerConfig';

export type { ParabolicSarLayerConfig, ParabolicSarLayerConfigComplete };

const parabolicSar: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate: calc,
  draw,
};

export default parabolicSar;
