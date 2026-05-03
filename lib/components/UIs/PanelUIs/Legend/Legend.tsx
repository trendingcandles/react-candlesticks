/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Fragment, forwardRef, memo, useCallback, useImperativeHandle, useRef } from 'react';
import { LegendConfigComplete } from '../../../../config/legend/LegendConfig';
import { DataPoint } from '../../../../domain/types/DataPoint';
import styles from './styles.module.scss';
import { LayerConfigComplete } from '../../../../config/layer/LayerConfig';
import DataPointInfo from '../../../../domain/types/DataPointInfo';

export interface LegendHandle {
  update: (dataPoint: DataPointInfo | null, latestDataPoint?: DataPoint) => void;
}

export interface LegendProps {
  layer: LayerConfigComplete;
  legend: LegendConfigComplete;
}

const Legend = forwardRef<LegendHandle, LegendProps>(function Legend({
  layer,
  legend,
}, ref) {

  const valueSpansRef = useRef<HTMLSpanElement[]>([]);

  const {
    left,
    hPadding,
    vPadding,
    backgroundColor,
    color,
    borderRadius,
    label,
    fields,
  } = legend;

  const update = useCallback((dataPointInfo: DataPointInfo | null) => {
    const layerDataInstance =  dataPointInfo?.layerDataInstances[layer.id];
    if (!layerDataInstance) return;
    if (valueSpansRef.current.length > 0) {
      for (let i = 0; i < valueSpansRef.current.length; i++) {
        const spanEl: HTMLSpanElement = valueSpansRef.current[i];
        const { output } = fields[i];
        const { valueLabelFormatter } = layer;
        const value = layerDataInstance.outputValues[output][dataPointInfo.barIndex];
        spanEl.textContent = !isNaN(value) ? valueLabelFormatter(value) : '-';
      }
    }
  }, [layer, fields]);

  useImperativeHandle(ref, () => ({
    update,
  }), [update]);

  return (
    <div
      className={styles.legend}
      style={{
        marginLeft: `${left}px`,
        paddingLeft: `${hPadding}px`,
        paddingRight: `${hPadding}px`,
        paddingTop: `${vPadding}px`,
        paddingBottom: `${vPadding}px`,
        color,
        backgroundColor,
        borderRadius: `${borderRadius}px`,
      }}
    >
      
      {label && <span className={styles.legendLabel}>{label}</span>}
      
      {fields.map((f, index) => (
        <Fragment key={f.output}>
          {f.label &&
            <span
              className={styles.fieldLabel}
            >
              {f.label}
            </span>
          }
          <span
            ref={el => {if (el) valueSpansRef.current[index] = el}}
            className={styles.fieldValue}
            style={{
              color: f.color,
            }}
          >
            -
          </span>
        </Fragment>
      ))}
      
    </div>
  );

});

Legend.displayName = 'Legend';

export default memo(Legend);
