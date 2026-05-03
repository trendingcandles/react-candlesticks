/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

const clearChartCrosshairs = (
  crosshairsContext: CanvasRenderingContext2D,
) => {

  crosshairsContext.clearRect(0, 0, crosshairsContext.canvas.width, crosshairsContext.canvas.height);

};

export default clearChartCrosshairs;
