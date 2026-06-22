import PropTypes from 'prop-types';
import themes, { ThemeName } from '../../themes/themes';

const themeNames = Object.keys(themes) as ThemeName[];

type InternalPropTypeValidator = (
  props: Record<string, unknown>,
  propName: string,
  componentName: string,
  location: string,
  propFullName: string,
  secret?: string,
) => Error | null;

const combinePropValidators = (...validators: InternalPropTypeValidator[]): InternalPropTypeValidator => {
  return (props, propName, componentName, location, propFullName, secret) => {
    for (const validator of validators) {
      const error = validator(props, propName, componentName, location, propFullName, secret);
      if (error) {
        return error;
      }
    }

    return null;
  };
};

const validatePanelsChildrenExclusivity: InternalPropTypeValidator = (props, _propName, componentName) => {
  const hasPanels = props.panels !== undefined;
  const hasChildren = props.children !== undefined;

  if (hasPanels && hasChildren) {
    return new Error(
      `${componentName} cannot accept both \`panels\` and \`children\`. Provide one or the other.`,
    );
  }

  if (!hasPanels && !hasChildren) {
    return new Error(
      `${componentName} requires either \`panels\` or \`children\` to define at least one panel.`,
    );
  }

  return null;
};

const validateNonEmptyPanels: InternalPropTypeValidator = (props, propName, componentName) => {
  const value = props[propName];

  if (Array.isArray(value) && value.length === 0) {
    return new Error(`${componentName} expects \`${propName}\` to contain at least one panel.`);
  }

  return null;
};

const validateWidthOrHeight = (propName: 'width' | 'height'): InternalPropTypeValidator => {
  return (props, _ignoredPropName, componentName, location, propFullName, secret) => {
    const validator = PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf(['auto']),
    ]) as unknown as InternalPropTypeValidator;

    return validator(props, propName, componentName, location, propFullName, secret);
  };
};

const panelsArrayValidator = PropTypes.arrayOf(PropTypes.object.isRequired) as unknown as InternalPropTypeValidator;
const nodeValidator = PropTypes.node as unknown as InternalPropTypeValidator;

const chartPropTypes = {
  width: validateWidthOrHeight('width'),
  height: validateWidthOrHeight('height'),
  intervalWidthPx: PropTypes.number,
  granularity: PropTypes.string,
  backgroundColor: PropTypes.string,
  xAxis: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  grid: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  crosshairs: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  theme: PropTypes.oneOfType([
    PropTypes.oneOf(themeNames),
    PropTypes.object,
  ]),
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  scrollToLatestMargin: PropTypes.number,
  initialScrollToLatest: PropTypes.bool,
  onScroll: PropTypes.func,
  onZoom: PropTypes.func,
  onViewportChange: PropTypes.func,
  enableScroll: PropTypes.bool,
  enableZoom: PropTypes.bool,
  scaleSmoothing: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  layerDefinitions: PropTypes.arrayOf(PropTypes.object.isRequired),
  drawingDefinitions: PropTypes.arrayOf(PropTypes.object.isRequired),
  onDrawingHover: PropTypes.func,
  onDrawingClick: PropTypes.func,
  onLayerHover: PropTypes.func,
  onLayerClick: PropTypes.func,
  panels: combinePropValidators(
    (props, propName, componentName, location, propFullName, secret) =>
      panelsArrayValidator(props, propName, componentName, location, propFullName, secret),
    validatePanelsChildrenExclusivity,
    validateNonEmptyPanels,
  ),
  children: combinePropValidators(
    (props, propName, componentName, location, propFullName, secret) =>
      nodeValidator(props, propName, componentName, location, propFullName, secret),
    validatePanelsChildrenExclusivity,
  ),
};

export default chartPropTypes;
