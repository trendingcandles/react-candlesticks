/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { forwardRef, JSX, memo, RefAttributes, ForwardRefExoticComponent } from 'react';
import Chart, { ChartHandle, ChartProps } from './Chart';
import chartPropTypes from './chartPropTypes';

type ChartWithPropTypesComponent = ForwardRefExoticComponent<ChartProps & RefAttributes<ChartHandle>> & {
  propTypes?: Record<string, unknown>;
};

const ChartWithPropTypes = memo(forwardRef<ChartHandle, ChartProps>(function ChartWithPropTypes(props, ref): JSX.Element {
  return <Chart ref={ref} {...props} />;
})) as ChartWithPropTypesComponent;

ChartWithPropTypes.displayName = 'Chart';
ChartWithPropTypes.propTypes = chartPropTypes;

export default ChartWithPropTypes;
