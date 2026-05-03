/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { JSX, memo, NamedExoticComponent } from 'react';
import Chart, { ChartProps } from './Chart';
import chartPropTypes from './chartPropTypes';

type ChartWithPropTypesComponent = NamedExoticComponent<ChartProps> & {
  propTypes?: Record<string, unknown>;
};

const ChartWithPropTypes = memo(function ChartWithPropTypes(props: ChartProps): JSX.Element {
  return <Chart {...props} />;
}) as ChartWithPropTypesComponent;

ChartWithPropTypes.displayName = 'Chart';
ChartWithPropTypes.propTypes = chartPropTypes;

export default ChartWithPropTypes;
