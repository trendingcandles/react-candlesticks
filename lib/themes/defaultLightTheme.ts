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
import { Theme } from '../domain/types/Theme';

const defaultLightTheme: Theme = {
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
    adx: {
      series: {
        value: { color: '#1a1a1a', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ccc', borderColor: '#ccc', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#555', width: 1, style: 'dashed', dashes: [5, 5] },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'value', color: '#1a1a1a' }],
      },
      yAxis: {
        ...themeDefaultYAxis,
      }
    },
    atr: {
      series: {
        value: { color: '#1a1a1a', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ccc', borderColor: '#ccc', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 8 },
          line: { color: '#555', width: 1, style: 'dashed', dashes: [5, 5] },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'value', color: '#1a1a1a' }],
      },
      yAxis: {
        ...themeDefaultYAxis,
      }
    },
    cci: {
      series: {
        value: { color: '#1a1a1a', width: 1, style: 'solid' },
        smoothing: { color: '#ef4444', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ccc', borderColor: '#ccc', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#555', width: 1, style: 'dashed', dashes: [5, 5] },
        },
        smoothing: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ef4444', borderColor: '#ef4444', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#ef4444', width: 1, style: 'dashed', dashes: [5, 5] },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [
          { output: 'value', color: '#1a1a1a' },
          { output: 'smoothing', color: '#ef4444' },
        ],
      },
      yAxis: { ...themeDefaultYAxis },
    },
    obv: {
      series: {
        value: { color: '#1a1a1a', width: 1, style: 'solid' },
        smoothing: { color: '#ef4444', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ccc', borderColor: '#ccc', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#555', width: 1, style: 'dashed', dashes: [5, 5] },
        },
        smoothing: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ef4444', borderColor: '#ef4444', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#ef4444', width: 1, style: 'dashed', dashes: [5, 5] },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [
          { output: 'value', color: '#1a1a1a' },
          { output: 'smoothing', color: '#ef4444' },
        ],
      },
      yAxis: { ...themeDefaultYAxis },
    },
    parabolicSar: {
      series: {
        value: { color: 'dodgerblue', width: 1, style: 'solid' },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'value', color: 'dodgerblue' }],
      },
      yAxis: { ...themeDefaultYAxis },
    },
    williamsR: {
      series: {
        value: { color: '#1a1a1a', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ccc', borderColor: '#ccc', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#555', width: 1, style: 'dashed', dashes: [5, 5] },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'value', color: '#1a1a1a' }],
      },
      yAxis: { ...themeDefaultYAxis },
    },
    bollingerBands: {
      series: {
        upper: { color: '#777', width: 1, style: 'solid' },
        middle: { color: '#777', width: 1, style: 'solid' },
        lower: { color: '#777', width: 1, style: 'solid' },
      },
      bands: {
        channel: { fillColor: '#00000011' },
      },
      markers: {
        value: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ccc', borderColor: '#ccc', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#555', width: 1, style: 'dashed', dashes: [5, 5] },
        },
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
    ema: {
      series: {
        value: { color: '#1a1a1a', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#333', borderColor: '#333', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#333', width: 1, style: 'dashed', dashes: [5, 5] },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'value', color: '#1a1a1a' }],
      },
      yAxis: {
        ...themeDefaultYAxis,
      }
    },
    macd: {
      series: {
        macd: { color: '#1a1a1a', width: 1, style: 'solid' },
        signal: { color: '#ef4444', width: 1, style: 'solid' },
        histogramUp: { width: 0.4,  backgroundColor: '#10b981', borderColor: '#10b981', borderWidth: 0 },
        histogramDown: { width: 0.4, backgroundColor: '#ef4444', borderColor: '#ef4444', borderWidth: 0 },
      },
      markers: {
        macd: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#1a1a1a', borderColor: '#1a1a1a', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#1a1a1a', width: 1, style: 'dashed', dashes: [5, 5] },
        },
        signal: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ef4444', borderColor: '#ef4444', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#ef4444', width: 1, style: 'dashed', dashes: [5, 5] },
        },
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
    rsi: {
      series: {
        value: { color: '#1a1a1a', width: 1, style: 'solid' },
      },
      markers: {
        value: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ccc', borderColor: '#ccc', color: '#1a1a1a', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#555', width: 1, style: 'dashed', dashes: [5, 5] },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'value', color: '#1a1a1a' }],
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
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: 'orange', borderColor: '#ccc', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: 'orange', width: 1, style: 'dashed', dashes: [5, 5] },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [{ output: 'value', color: 'orange' }],
      },
      yAxis: {
        ...themeDefaultYAxis,
      }
    },
    stochastic: {
      series: {
        k: { color: '#1a1a1a', width: 1, style: 'solid' },
        d: { color: 'red', width: 1, style: 'solid' },
      },
      markers: {
        k: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#1a1a1a', borderColor: '#1a1a1a', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#1a1a1a', width: 1, style: 'dashed', dashes: [5, 5] },
        },
        d: {
          label: { ...themeDefaultLabel, padding: -3, backgroundColor: '#ef4444', borderColor: '#ef4444', color: 'white', borderWidth: 0, hPadding: 8, vPadding: 6 },
          line: { color: '#ef4444', width: 1, style: 'dashed', dashes: [5, 5] },
        },
      },
      legend: {
        ...themeDefaultLegend,
        fields: [
          { output: 'k', color: '#1a1a1a' },
          { output: 'd', color: '#ef4444' },
        ],
      },
      yAxis: {
        ...themeDefaultYAxis,
      }
    },
  },
};

export default defaultLightTheme;
