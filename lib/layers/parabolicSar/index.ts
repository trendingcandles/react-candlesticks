import defineLayer from '../defineLayer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { ParabolicSarLayerConfig, ParabolicSarLayerConfigComplete } from './ParabolicSarLayerConfig';

export type { ParabolicSarLayerConfig, ParabolicSarLayerConfigComplete };

const parabolicSar = defineLayer<ParabolicSarLayerConfig, ParabolicSarLayerConfigComplete>({
  type: 'parabolic-sar',
  displayName: 'ParabolicSARLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
});

export default parabolicSar;
