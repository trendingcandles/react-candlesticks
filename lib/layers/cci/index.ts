import Layer from '../../config/layer/Layer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { CciLayerConfig, CciLayerConfigComplete } from './CciLayerConfig';

export type { CciLayerConfig, CciLayerConfigComplete };

const cci: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate2: calc,
  draw,
};

export default cci;
