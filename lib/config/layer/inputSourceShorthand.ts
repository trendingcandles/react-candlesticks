/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { InputSource, PriceField, VolumeField } from './BaseLayerConfig';

export type LayerInputField = PriceField | VolumeField;

const createInputSourceFromField = (key: string, field: LayerInputField): InputSource => {
  if (field === 'volume') {
    return { key, source: { type: 'volume', field: 'volume' } };
  }

  return { key, source: { type: 'price', field } };
};

export const resolveSingleInputSource = (
  key: string,
  explicitInputs: InputSource[] | undefined,
  sourceField: LayerInputField | undefined,
  defaultInputs: InputSource[],
): InputSource[] => {
  if (explicitInputs) return explicitInputs;
  if (!sourceField) return defaultInputs;

  return [createInputSourceFromField(key, sourceField)];
};

export const sourceFieldToInput = createInputSourceFromField;
