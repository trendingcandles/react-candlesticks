import defineLayer from '../defineLayer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { ObvLayerConfig, ObvLayerConfigComplete } from './ObvLayerConfig';

export type { ObvLayerConfig, ObvLayerConfigComplete };

const obv = defineLayer<ObvLayerConfig, ObvLayerConfigComplete>({
  type: 'obv',
  displayName: 'OBVLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
});

export default obv;
