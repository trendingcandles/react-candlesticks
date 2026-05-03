/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { themeDefaultLabel } from '../config/elements/label/LabelConfig';
import { themeDefaultLegend } from '../config/legend/LegendConfig';
import { themeDefaultYAxis } from '../config/layer/yAxis/YAxisConfig';
import { Theme } from '../domain/types/Theme';

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

const defaultDarkTheme: Theme = {
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
    atr: {
      series: {
        value: { color: '#ddd', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          line:  { color: '#888', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#333', borderColor: '#333', color: '#ddd', borderWidth: 0, hPadding: 8, vPadding: 8 },
        },
      },
      legend: {
                ...themeDefaultLegend,

        fields: [{ output: 'value', color: '#ddd' }],
      },
       yAxis: {
        ...themeDefaultYAxis,
      }
    },
    bollingerBands: {
      series: {
        upper: { color: '#777', width: 1, style: 'solid' },
        middle: { color: '#777', width: 1, style: 'solid' },
        lower: { color: '#777', width: 1, style: 'solid' },
      },
      bands: {
        channel: { fillColor: '#ffffff0a' },
      },
      markers: {
        value: {
          line:  { color: '#888', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#333', borderColor: '#333', color: '#ddd', borderWidth: 0, hPadding: 8, vPadding: 6 },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [
          { output: 'upper',  color: '#ddd' },
          { output: 'middle', color: '#ddd' },
          { output: 'lower',  color: '#ddd' },
        ],
      },
       yAxis: {
        ...themeDefaultYAxis,
      }
    },
    ema: {
      series: {
        value: { color: '#ddd', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          line:  { color: '#ddd', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ddd', borderColor: '#ddd', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 6 },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'value', color: '#ddd' }],
      },
       yAxis: {
        ...themeDefaultYAxis,
      }
    },
    macd: {
      series: {
        macd: { color: '#ddd', width: 1, style: 'solid' },
        signal: { color: '#ef4444', width: 1, style: 'solid' },
        histogramUp: { width: 0.4, backgroundColor: '#10b981', borderColor: '#10b981', borderWidth: 0 },
        histogramDown: { width: 0.4, backgroundColor: '#ef4444', borderColor: '#ef4444', borderWidth: 0 },
      },
      markers: {
        macd: {
          line:  { color: '#ddd', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ddd', borderColor: '#ddd', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 6 },
        },
        signal: {
          line:  { color: '#ef4444', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ef4444', borderColor: '#ef4444', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [
          { output: 'macd',      color: '#ddd' },
          { output: 'signal',    color: '#ef4444' },
          { output: 'histogram', color: '#777' },
        ],
      },
       yAxis: {
        ...themeDefaultYAxis,
      }
    },
    rsi: {
      series: {
        value: { color: '#ddd', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          line:  { color: '#888', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#333', borderColor: '#333', color: '#ddd', borderWidth: 0, hPadding: 8, vPadding: 6 },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'value', color: '#ddd' }],
      },
       yAxis: {
        ...themeDefaultYAxis,
      }
    },
    sma: {
      series: {
        value: { color: 'orange', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          line:  { color: 'orange', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: 'orange', borderColor: 'orange', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
        },
      },
      legend: {
        ...themeDefaultDarkLegend,
        fields: [{ output: 'value', color: 'orange' }],
      },
       yAxis: {
        ...themeDefaultDarkYAxis,
      }
    },
    stochastic: {
      series: {
        k: { color: '#ddd',    width: 1, style: 'solid' },
        d: { color: '#ef4444', width: 1, style: 'solid' },
      },
      markers: {
        k: {
          line:  { color: '#ddd', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ddd', borderColor: '#ddd', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 6 },
        },
        d: {
          line:  { color: '#ef4444', width: 1, style: 'dashed', dashes: [5, 5] },
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ef4444', borderColor: '#ef4444', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
        },
      },
      legend: {
        ...themeDefaultDarkLegend,
        fields: [
          { output: 'k', color: '#ddd' },
          { output: 'd', color: '#ef4444' },
        ],
      },
       yAxis: {
        ...themeDefaultDarkYAxis,
      }
    },
  },
};

export default defaultDarkTheme;
