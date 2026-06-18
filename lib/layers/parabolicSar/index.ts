import defineLayer from '../defineLayer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { ParabolicSarLayerConfig, ParabolicSarLayerConfigComplete } from './ParabolicSarLayerConfig';
import hitTest from './hitTest';
import { onLayerElementClick, onLayerElementHover } from '../interactionHandlers';

export type { ParabolicSarLayerConfig, ParabolicSarLayerConfigComplete };

const parabolicSar = defineLayer<ParabolicSarLayerConfig, ParabolicSarLayerConfigComplete>({
  type: 'parabolic-sar',
  displayName: 'ParabolicSARLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
  hitTest,
  onHover: onLayerElementHover,
  onClick: onLayerElementClick,
});

export default parabolicSar;
