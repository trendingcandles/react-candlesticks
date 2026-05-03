/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { InputSource } from './BaseLayerConfig';

const validateLayerInputs = (inputs: InputSource[], requiredInputKeys: string[]) => {
  const providedKeys = new Set(inputs.map(input => input.key));
  
  const missingKeys = requiredInputKeys.filter(key => !providedKeys.has(key));
  
  if (missingKeys.length > 0) {
    throw new Error(`Missing required input keys: ${missingKeys.join(', ')}`);
  }
  
  // Check for duplicate keys
  const duplicates = inputs
    .map(input => input.key)
    .filter((key, index, arr) => arr.indexOf(key) !== index);
  
  if (duplicates.length > 0) {
    throw new Error(`Duplicate input keys found: ${[...new Set(duplicates)].join(', ')}`);
  }
};
export default validateLayerInputs;
