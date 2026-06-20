/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { themeDefaultBorders } from '../config/chart/borders/BordersConfig';
import { themeDefaultButton } from '../config/elements/button/ButtonConfig';
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

const lightIndicatorDefaults: IndicatorThemeDefaults = {
  lineColor: '#1a1a1a',
  secondaryLineColor: '#ef4444',
  positiveColor: '#10b981',
  negativeColor: '#ef4444',
  neutralColor: '#777',
  markerLineColor: '#555',
  markerLabelBackgroundColor: '#ccc',
  markerLabelBorderColor: '#ccc',
  markerLabelColor: '#1a1a1a',
  markerLabelContrastColor: 'white',
  legend: themeDefaultLegend,
  yAxis: themeDefaultYAxis,
};

const defaultLightTheme: ThemeComplete = {
  chart: {
    backgroundColor: 'white',
    borders: {
      ...themeDefaultBorders,
    },
    xAxis: {
      height: 60,
      border: { color: '#ddd', width: 1, style: 'solid' },
      minorLabels: {
        ...themeDefaultLabel,
        top: 8,
      },
      majorLabels: {
        ...themeDefaultLabel,
        fontWeight: 600,
        top: 20,
      },
    },
    grid: {
      time: { color: '#ccc', width: 0.5, style: 'solid' },
      value: { color: '#ccc', width: 0.5, style: 'solid' },
    },
    crosshairs: {
      time: {
        line: { color: '#555', width: 0.5, style: 'dashed', dashes: [5, 5] },
        label: {
          ...themeDefaultLabel,
          top: 8,
          backgroundColor: '#1a1a1a',
          borderColor: '#1a1a1a',
          color: 'white',
          borderWidth: 0,
          hPadding: 12,
          vPadding: 6,
        },
      },
      value: {
        line: { color: '#555', width: 0.5, style: 'dashed', dashes: [5, 5] },
        label: {
          ...themeDefaultLabel,
          padding: 8,
          backgroundColor: '#1a1a1a',
          borderColor: '#1a1a1a',
          color: 'white',
          borderWidth: 0,
          hPadding: 8,
          vPadding: 6,
        },
      },
    },
  },
  panels: {
    paddingTop: 16,
    paddingBottom: 16,
    borderTop: { color: '#ddd', width: 2, style: 'solid' },
    controls: {
      goToLatestButton: {
        ...themeDefaultButton,
      },
    },
  },
  layers: {
    candlesticks: {
      series: {
        body: {
        up: {
          width: 0.6,
          backgroundColor: '#10b981',
          borderColor: '#10b981',
          borderWidth: 0,
        },
        down: {
          width: 0.6,
          backgroundColor: '#ef4444',
          borderColor: '#ef4444',
          borderWidth: 0,
        },
        flat: {
          width: 0.6,
          backgroundColor: '#333',
          borderColor: '#333',
          borderWidth: 0,
        },
      },
      wick: {
        up: {
          width: 1,
          color: '#10b981',
          style: 'solid',
          dashes: [5, 5],
        },
        down: {
          width: 1,
          color: '#ef4444',
          style: 'solid',
          dashes: [5, 5],
        },
        flat: {
          width: 1,
          color: '#333',
          style: 'solid',
          dashes: [5, 5],
        },
      },
      },
      markers: {
        value: {
        up: {
          line: {
            color: '#10b981',
            width: 1,
            style: 'dashed',
            dashes: [5, 5],
          },
          label: {
            ...themeDefaultLabel,
            padding: -3,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#10b981',
            color: '#10b981',
            fontWeight: 'bold',
            hPadding: 8,
            vPadding: 6,
          },
        },
        down: {
          line: {
            color: '#ef4444',
            width: 1,
            style: 'dashed',
            dashes: [5, 5],
          },
          label: {
            ...themeDefaultLabel,
            padding: -3,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#ef4444',
            color: '#ef4444',
            hPadding: 8,
            vPadding: 6,
          },
        },
        flat: {
          line: {
            color: '#10b981',
            width: 1,
            style: 'dashed',
            dashes: [5, 5],
          },
          label: {
            ...themeDefaultLabel,
            padding: -3,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#10b981',
            color: '#10b981',
            hPadding: 8,
            vPadding: 6,
          },
        },
      },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [
          { output: 'open', color: '#1a1a1a' },
          { output: 'high', color: '#1a1a1a' },
          { output: 'low', color: '#1a1a1a' },
          { output: 'close', color: '#1a1a1a' },
        ],
      },
      yAxis: {
        ...themeDefaultYAxis,
      }
    },
    priceLine: {
      series: {
        value: { color: 'dodgerblue', width: 2, style: 'solid', endDotSize: 5 },
      },
      markers: {
        value: {
          label: { ...themeDefaultLabel, padding: 8, backgroundColor: 'dodgerblue', borderColor: '#ccc', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: 'dodgerblue', width: 1, style: 'dashed', dashes: [5, 5] },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'price', color: 'dodgerblue', label: '' }],
      },
      yAxis: {
        ...themeDefaultYAxis,
      }
    },
    volumeBars: {
      series: {
        bars: {
        up: {
          width: 0.6,
          backgroundColor: '#10b98177',
          borderColor: '#10b98177',
          borderWidth: 0,
        },
        down: {
          width: 0.6,
          backgroundColor: '#ef444477',
          borderColor: '#ef444477',
          borderWidth: 0,
        },
        flat: {
          width: 0.6,
          backgroundColor: '#ccc',
          borderColor: '#ccc',
          borderWidth: 1,
        },
      },
      },
      markers: {
        value: {
        label: {
          ...themeDefaultLabel,
          padding: -3,
          color: '#1a1a1a',
          backgroundColor: '#ccc',
          borderWidth: 0,
          borderColor: '#ccc',
          hPadding: 8,
          vPadding: 6,
        },
        line: {
          color: '#555',
          width: 1,
          style: 'dashed',
          dashes: [5, 5],
        },
      },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'volume', color: '#1a1a1a' }],
      },
      yAxis: {
        ...themeDefaultYAxis,
      }
    },
    adx: createSingleLineIndicatorTheme(lightIndicatorDefaults, 'value'),
    atr: createSingleLineIndicatorTheme(lightIndicatorDefaults, 'value', { markerVPadding: 8 }),
    cci: createTwoLineIndicatorTheme(lightIndicatorDefaults, 'value', 'smoothing'),
    obv: createTwoLineIndicatorTheme(lightIndicatorDefaults, 'value', 'smoothing'),
    parabolicSar: {
      series: {
        value: createIndicatorLine('dodgerblue'),
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'value', color: 'dodgerblue' }],
      },
      yAxis: { ...themeDefaultYAxis },
    },
    williamsR: createSingleLineIndicatorTheme(lightIndicatorDefaults, 'value'),
    bollingerBands: {
      series: {
        upper: createIndicatorLine('#777'),
        middle: createIndicatorLine('#777'),
        lower: createIndicatorLine('#777'),
      },
      bands: {
        channel: { fillColor: '#00000011' },
      },
      markers: {
        value: createIndicatorMarker({
          color: lightIndicatorDefaults.lineColor,
          lineColor: lightIndicatorDefaults.markerLineColor,
          backgroundColor: lightIndicatorDefaults.markerLabelBackgroundColor,
          borderColor: lightIndicatorDefaults.markerLabelBorderColor,
          labelColor: lightIndicatorDefaults.markerLabelColor,
        }),
      },
      legend: {
        ...themeDefaultLegend,
        fields: [
          { output: 'upper', color: '#1a1a1a' },
          { output: 'middle', color: '#1a1a1a' },
          { output: 'lower', color: '#1a1a1a' },
        ],
      },
      yAxis: {
        ...themeDefaultYAxis,
      }
    },
    ema: createSingleLineIndicatorTheme(lightIndicatorDefaults, 'value', {
      markerLineColor: '#333',
      markerBackgroundColor: '#333',
      markerBorderColor: '#333',
      markerLabelColor: 'white',
    }),
    macd: {
      series: {
        macd: createIndicatorLine(lightIndicatorDefaults.lineColor),
        signal: createIndicatorLine(lightIndicatorDefaults.secondaryLineColor),
        histogramUp: createIndicatorBar(lightIndicatorDefaults.positiveColor),
        histogramDown: createIndicatorBar(lightIndicatorDefaults.negativeColor),
      },
      markers: {
        macd: createIndicatorMarker({
          color: lightIndicatorDefaults.lineColor,
          backgroundColor: lightIndicatorDefaults.lineColor,
          labelColor: lightIndicatorDefaults.markerLabelContrastColor,
        }),
        signal: createIndicatorMarker({
          color: lightIndicatorDefaults.secondaryLineColor,
          backgroundColor: lightIndicatorDefaults.secondaryLineColor,
          labelColor: lightIndicatorDefaults.markerLabelContrastColor,
        }),
      },
      legend: {
        ...themeDefaultLegend,
        fields: [
          { output: 'macd', color: '#1a1a1a' },
          { output: 'signal', color: '#ef4444' },
          { output: 'histogram', color: '#777' },
        ],
      },
      yAxis: {
        ...themeDefaultYAxis,
      }
    },
    rsi: createSingleLineIndicatorTheme(lightIndicatorDefaults, 'value'),
    sma: createSingleLineIndicatorTheme(lightIndicatorDefaults, 'value', {
      color: 'orange',
      markerBackgroundColor: 'orange',
      markerBorderColor: '#ccc',
      markerLabelColor: 'white',
    }),
    stochastic: createTwoLineIndicatorTheme(lightIndicatorDefaults, 'k', 'd', {
      secondaryColor: '#ef4444',
      secondaryLegendColor: '#ef4444',
    }),
  },
};

export default defaultLightTheme;
