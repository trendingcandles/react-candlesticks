/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { themeDefaultLabel } from '../config/elements/label/LabelConfig';
import { themeDefaultLegend } from '../config/legend/LegendConfig';
import { themeDefaultYAxis } from '../config/layer/yAxis/YAxisConfig';
import { ThemeComplete } from '../domain/types/Theme';
import {
  createIndicatorBar,
  createIndicatorLine,
  createIndicatorMarker,
  createSingleLineIndicatorTheme,
  createTwoLineIndicatorTheme,
  IndicatorThemeDefaults,
} from './indicatorThemeHelpers';

const themeDefaultDarkLegend: typeof themeDefaultLegend = {
  ...themeDefaultLegend,
  backgroundColor: '#ffffff16',
  vPadding: 2,
  color: '#ffffff99',
};

const themeDefaultDarkYAxis: typeof themeDefaultYAxis ={
  ...themeDefaultYAxis,
  labels: {
    ...themeDefaultYAxis.labels,
    color: '#ffffff99',
  },
};

const darkIndicatorDefaults: IndicatorThemeDefaults = {
  lineColor: '#ddd',
  secondaryLineColor: '#ef4444',
  positiveColor: '#10b981',
  negativeColor: '#ef4444',
  neutralColor: '#777',
  markerLineColor: '#888',
  markerLabelBackgroundColor: '#333',
  markerLabelBorderColor: '#333',
  markerLabelColor: '#ddd',
  markerLabelContrastColor: 'white',
  legend: themeDefaultDarkLegend,
  yAxis: themeDefaultDarkYAxis,
};

const defaultDarkTheme: ThemeComplete = {
  chart: {
    backgroundColor: '#1a1a1a',
    borders: {
      left:   { color: '#333', width: 1, style: 'solid' },
      right:  { color: '#333', width: 1, style: 'solid' },
      top:    { color: '#333', width: 1, style: 'solid' },
      bottom: { color: '#333', width: 1, style: 'solid' },
    },
    xAxis: {
      height: 60,
      border: { color: '#333', width: 1, style: 'solid' },
      minorLabels: {
        ...themeDefaultLabel,
        color: '#ffffff99',
        fontSize: 12,
        fontWeight: 'normal',
        fontVariant: 'normal',
        fontStyle: 'normal',
        top: 8,
      },
      majorLabels: {
        ...themeDefaultLabel,
        color: '#ffffff99',
        fontSize: 12,
        fontWeight: 600,
        fontVariant: 'normal',
        fontStyle: 'normal',
        top: 20,
      },
    },
    grid: {
      time:  { color: '#2e2e2e', width: 0.5, style: 'solid' },
      value: { color: '#2e2e2e', width: 0.5, style: 'solid' },
    },
    crosshairs: {
      time: {
        line:  { color: '#888', width: 0.5, style: 'dashed', dashes: [5, 5] },
        label: { ...themeDefaultLabel, top: 8, backgroundColor: '#ddd', borderColor: '#ddd', color: '#1a1a1a', borderWidth: 0, hPadding: 12, vPadding: 6 },
      },
      value: {
        line:  { color: '#888', width: 0.5, style: 'dashed', dashes: [5, 5] },
        label: { ...themeDefaultLabel, padding: 8, backgroundColor: '#ddd', borderColor: '#ddd', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 6 },
      },
    },
  },
  panels: {
    paddingTop: 16,
    paddingBottom: 16,
    borderTop: { color: '#333', width: 2, style: 'solid' },
    controls: {
      goToLatestButton: {
        color: '#ddd',
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'normal',
        fontVariant: 'normal',
        fontStyle: 'normal',
        backgroundColor: '#2e2e2e',
        borderColor: '#444',
        borderWidth: 1,
        borderRadius: 4,
      },
    },
  },
  layers: {
    candlesticks: {
      series: {
        body: {
        up:   { width: 0.6, backgroundColor: '#10b981', borderColor: '#10b981', borderWidth: 0 },
        down: { width: 0.6, backgroundColor: '#ef4444', borderColor: '#ef4444', borderWidth: 0 },
        flat: { width: 0.6, backgroundColor: '#aaa',    borderColor: '#aaa',    borderWidth: 0 },
      },
      wick: {
        up:   { width: 1, color: '#10b981', style: 'solid' },
        down: { width: 1, color: '#ef4444', style: 'solid' },
        flat: { width: 1, color: '#aaa',    style: 'solid' },
      },
      },
      markers: {
        value: {
        up: {
          line:  { color: '#10b981', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#10b981', color: '#10b981', fontWeight: 'bold', hPadding: 8, vPadding: 6 },
        },
        down: {
          line:  { color: '#ef4444', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#ef4444', color: '#ef4444', hPadding: 8, vPadding: 6 },
        },
        flat: {
          line:  { color: '#aaa', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#aaa', color: '#aaa', hPadding: 8, vPadding: 6 },
        },
      },
      },
      legend: {
        ...themeDefaultDarkLegend,
        fields: [
          { output: 'open',  color: '#ddd' },
          { output: 'high',  color: '#ddd' },
          { output: 'low',   color: '#ddd' },
          { output: 'close', color: '#ddd' },
        ],
      },
       yAxis: {
        ...themeDefaultDarkYAxis,
      }
    },
    ohlcBars: {
      series: {
        bars: {
          up:   { width: 0.6, backgroundColor: '#10b981', borderColor: '#10b981', borderWidth: 1 },
          down: { width: 0.6, backgroundColor: '#ef4444', borderColor: '#ef4444', borderWidth: 1 },
          flat: { width: 0.6, backgroundColor: '#aaa',    borderColor: '#aaa',    borderWidth: 1 },
        },
      },
      markers: {
        value: {
          up: {
            line:  { color: '#10b981', width: 1, style: 'dashed', dashes: [5, 5] },
            label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#10b981', color: '#10b981', fontWeight: 'bold', hPadding: 8, vPadding: 6 },
          },
          down: {
            line:  { color: '#ef4444', width: 1, style: 'dashed', dashes: [5, 5] },
            label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#ef4444', color: '#ef4444', hPadding: 8, vPadding: 6 },
          },
          flat: {
            line:  { color: '#aaa', width: 1, style: 'dashed', dashes: [5, 5] },
            label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#aaa', color: '#aaa', hPadding: 8, vPadding: 6 },
          },
        },
      },
      legend: {
        ...themeDefaultDarkLegend,
        fields: [
          { output: 'open',  color: '#ddd' },
          { output: 'high',  color: '#ddd' },
          { output: 'low',   color: '#ddd' },
          { output: 'close', color: '#ddd' },
        ],
      },
       yAxis: {
        ...themeDefaultDarkYAxis,
      }
    },
    priceLine: {
      series: {
        value: { color: 'dodgerblue', width: 2, style: 'solid', endDotSize: 5 },
      },
      markers: {
        value: {
          line:  { color: 'dodgerblue', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: 8, backgroundColor: 'dodgerblue', borderColor: 'dodgerblue', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
        },
      },
      legend: {
        ...themeDefaultDarkLegend,
        fields: [{ output: 'price', color: 'dodgerblue', label: '' }],
      },
       yAxis: {
        ...themeDefaultDarkYAxis,
      }
    },
    area: {
      series: {
        value: {
          line: { color: 'dodgerblue', width: 2, style: 'solid', endDotSize: 5 },
          fill: { topColor: '#1e90ff44', bottomColor: '#1e90ff00' },
        },
      },
      markers: {
        value: {
          line:  { color: 'dodgerblue', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: 8, backgroundColor: 'dodgerblue', borderColor: 'dodgerblue', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
        },
      },
      legend: {
        ...themeDefaultDarkLegend,
        fields: [{ output: 'price', color: 'dodgerblue', label: '' }],
      },
       yAxis: {
        ...themeDefaultDarkYAxis,
      }
    },
    volumeBars: {
      series: {
        bars: {
        up:   { width: 0.6, backgroundColor: '#10b98177', borderColor: '#10b98177', borderWidth: 0 },
        down: { width: 0.6, backgroundColor: '#ef444477', borderColor: '#ef444477', borderWidth: 0 },
        flat: { width: 0.6, backgroundColor: '#555',      borderColor: '#555',      borderWidth: 0 },
      },
      },
      markers: {
        value: {
        line:  { color: '#888', width: 1, style: 'dashed', dashes: [5, 5] },
        label: { ...themeDefaultLabel, padding: -3, color: '#ddd', backgroundColor: '#333', borderWidth: 0, borderColor: '#333', hPadding: 8, vPadding: 6 },
      },
      },
      legend: {
        ...themeDefaultDarkLegend,
        fields: [{ output: 'volume', color: '#ddd' }],
      },
       yAxis: {
        ...themeDefaultDarkYAxis,
      }
    },
    adx: createSingleLineIndicatorTheme(darkIndicatorDefaults, 'value'),
    atr: createSingleLineIndicatorTheme(darkIndicatorDefaults, 'value', { markerVPadding: 8 }),
    cci: createTwoLineIndicatorTheme(darkIndicatorDefaults, 'value', 'smoothing'),
    obv: createTwoLineIndicatorTheme(darkIndicatorDefaults, 'value', 'smoothing'),
    parabolicSar: {
      series: {
        value: createIndicatorLine('dodgerblue'),
      },
      legend: {
        ...themeDefaultDarkLegend,
        fields: [{ output: 'value', color: 'dodgerblue' }],
      },
      yAxis: { ...themeDefaultDarkYAxis },
    },
    williamsR: createSingleLineIndicatorTheme(darkIndicatorDefaults, 'value'),
    bollingerBands: {
      series: {
        upper: createIndicatorLine('#777'),
        middle: createIndicatorLine('#777'),
        lower: createIndicatorLine('#777'),
      },
      bands: {
        channel: { fillColor: '#ffffff0a' },
      },
      markers: {
        value: createIndicatorMarker({
          color: darkIndicatorDefaults.lineColor,
          lineColor: darkIndicatorDefaults.markerLineColor,
          backgroundColor: darkIndicatorDefaults.markerLabelBackgroundColor,
          borderColor: darkIndicatorDefaults.markerLabelBorderColor,
          labelColor: darkIndicatorDefaults.markerLabelColor,
        }),
      },
      legend: {
        ...themeDefaultDarkLegend,
        fields: [
          { output: 'upper', color: '#ddd' },
          { output: 'middle', color: '#ddd' },
          { output: 'lower', color: '#ddd' },
        ],
      },
      yAxis: {
        ...themeDefaultDarkYAxis,
      }
    },
    ema: createSingleLineIndicatorTheme(darkIndicatorDefaults, 'value', {
      markerLineColor: '#ddd',
      markerBackgroundColor: '#ddd',
      markerBorderColor: '#ddd',
      markerLabelColor: '#1a1a1a',
    }),
    macd: {
      series: {
        macd: createIndicatorLine(darkIndicatorDefaults.lineColor),
        signal: createIndicatorLine(darkIndicatorDefaults.secondaryLineColor),
        histogramUp: createIndicatorBar(darkIndicatorDefaults.positiveColor),
        histogramDown: createIndicatorBar(darkIndicatorDefaults.negativeColor),
      },
      markers: {
        macd: createIndicatorMarker({
          color: darkIndicatorDefaults.lineColor,
          backgroundColor: darkIndicatorDefaults.lineColor,
          labelColor: '#1a1a1a',
        }),
        signal: createIndicatorMarker({
          color: darkIndicatorDefaults.secondaryLineColor,
          backgroundColor: darkIndicatorDefaults.secondaryLineColor,
          labelColor: darkIndicatorDefaults.markerLabelContrastColor,
        }),
      },
      legend: {
        ...themeDefaultDarkLegend,
        fields: [
          { output: 'macd', color: '#ddd' },
          { output: 'signal', color: '#ef4444' },
          { output: 'histogram', color: '#777' },
        ],
      },
      yAxis: {
        ...themeDefaultDarkYAxis,
      }
    },
    rsi: createSingleLineIndicatorTheme(darkIndicatorDefaults, 'value'),
    sma: createSingleLineIndicatorTheme(darkIndicatorDefaults, 'value', {
      color: 'orange',
      markerLineColor: 'orange',
      markerBackgroundColor: 'orange',
      markerBorderColor: 'orange',
      markerLabelColor: 'white',
    }),
    stochastic: createTwoLineIndicatorTheme(darkIndicatorDefaults, 'k', 'd'),
  },
};

export default defaultDarkTheme;
