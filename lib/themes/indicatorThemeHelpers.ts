/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BarTheme } from '../config/elements/bar/BarConfig';
import { themeDefaultLabel } from '../config/elements/label/LabelConfig';
import { LineTheme } from '../config/elements/line/LineConfig';
import { LegendTheme } from '../config/legend/LegendConfig';
import { YAxisTheme } from '../config/layer/yAxis/YAxisConfig';
import { ValueMarkerTheme } from '../config/valueMarker/ValueMarkerConfig';

export type LegendBaseTheme = Omit<LegendTheme, 'fields'>;

export interface IndicatorThemeDefaults {
  lineColor: string;
  secondaryLineColor: string;
  positiveColor: string;
  negativeColor: string;
  neutralColor: string;
  markerLineColor: string;
  markerLabelBackgroundColor: string;
  markerLabelBorderColor: string;
  markerLabelColor: string;
  markerLabelContrastColor: string;
  legend: LegendBaseTheme;
  yAxis: YAxisTheme;
}

export const createIndicatorLine = (color: string, width = 1): LineTheme => ({
  color,
  width,
  style: 'solid',
});

export const createDashedIndicatorLine = (color: string): LineTheme => ({
  color,
  width: 1,
  style: 'dashed',
  dashes: [5, 5],
});

export const createIndicatorBar = (
  color: string,
  width = 0.4,
  borderWidth = 0,
): BarTheme => ({
  width,
  backgroundColor: color,
  borderColor: color,
  borderWidth,
});

export const createIndicatorMarker = ({
  color,
  lineColor = color,
  backgroundColor,
  borderColor = backgroundColor,
  labelColor,
  vPadding = 6,
}: {
  color: string;
  lineColor?: string;
  backgroundColor: string;
  borderColor?: string;
  labelColor: string;
  vPadding?: number;
}): ValueMarkerTheme => ({
  line: createDashedIndicatorLine(lineColor),
  label: {
    ...themeDefaultLabel,
    padding: -3,
    backgroundColor,
    borderColor,
    color: labelColor,
    borderWidth: 0,
    hPadding: 8,
    vPadding,
  },
});

const createLegend = (
  legend: LegendBaseTheme,
  fields: { output: string; color: string; label?: string }[],
): LegendTheme => ({
  ...legend,
  fields,
});

export const createSingleLineIndicatorTheme = <Output extends string>(
  defaults: IndicatorThemeDefaults,
  output: Output,
  options: {
    color?: string;
    legendColor?: string;
    markerLineColor?: string;
    markerBackgroundColor?: string;
    markerBorderColor?: string;
    markerLabelColor?: string;
    markerVPadding?: number;
  } = {},
) => {
  const color = options.color ?? defaults.lineColor;
  const markerBackgroundColor = options.markerBackgroundColor ?? defaults.markerLabelBackgroundColor;

  return {
    series: {
      [output]: createIndicatorLine(color),
    } as Record<Output, LineTheme>,
    markers: {
      [output]: createIndicatorMarker({
        color,
        lineColor: options.markerLineColor ?? defaults.markerLineColor,
        backgroundColor: markerBackgroundColor,
        borderColor: options.markerBorderColor ?? defaults.markerLabelBorderColor,
        labelColor: options.markerLabelColor ?? defaults.markerLabelColor,
        vPadding: options.markerVPadding,
      }),
    } as Record<Output, ValueMarkerTheme>,
    legend: createLegend(defaults.legend, [
      { output, color: options.legendColor ?? color },
    ]),
    yAxis: { ...defaults.yAxis },
  };
};

export const createTwoLineIndicatorTheme = <
  PrimaryOutput extends string,
  SecondaryOutput extends string,
>(
  defaults: IndicatorThemeDefaults,
  primaryOutput: PrimaryOutput,
  secondaryOutput: SecondaryOutput,
  options: {
    primaryColor?: string;
    secondaryColor?: string;
    primaryLegendColor?: string;
    secondaryLegendColor?: string;
  } = {},
) => {
  const primaryColor = options.primaryColor ?? defaults.lineColor;
  const secondaryColor = options.secondaryColor ?? defaults.secondaryLineColor;

  return {
    series: {
      [primaryOutput]: createIndicatorLine(primaryColor),
      [secondaryOutput]: createIndicatorLine(secondaryColor),
    } as Record<PrimaryOutput | SecondaryOutput, LineTheme>,
    markers: {
      [primaryOutput]: createIndicatorMarker({
        color: primaryColor,
        lineColor: defaults.markerLineColor,
        backgroundColor: defaults.markerLabelBackgroundColor,
        borderColor: defaults.markerLabelBorderColor,
        labelColor: defaults.markerLabelColor,
      }),
      [secondaryOutput]: createIndicatorMarker({
        color: secondaryColor,
        backgroundColor: secondaryColor,
        labelColor: defaults.markerLabelContrastColor,
      }),
    } as Record<PrimaryOutput | SecondaryOutput, ValueMarkerTheme>,
    legend: createLegend(defaults.legend, [
      { output: primaryOutput, color: options.primaryLegendColor ?? primaryColor },
      { output: secondaryOutput, color: options.secondaryLegendColor ?? secondaryColor },
    ]),
    yAxis: { ...defaults.yAxis },
  };
};
