# Changelog

All notable changes to `react-candlesticks` are documented here.

## 0.7.10 - 2026-07-24

### Added

- Added an opt-in `watermark` chart prop for rendering the website logo as a low-opacity watermark above the bottom axis area.
- Added theme-aware watermark defaults: low-opacity black for the built-in light theme, low-opacity white for the built-in dark theme and custom themes without an explicit watermark color.
- Added public root exports for chart configuration types, including `ChartConfig`, `BordersConfig`, `CrosshairsConfig`, `GridConfig`, `XAxisConfig`, `WatermarkConfig`, and their complete/theme variants.

## 0.7.9 - 2026-07-24

### Fixed

- Fixed crosshairs disappearing during zoom; crosshairs now remain visible and redraw against the updated viewport.
- Fixed crosshairs jumping between stale wheel-event coordinates and the latest pointer position during inertial mouse-wheel or Magic Mouse horizontal scrolling.

## 0.7.8 - 2026-07-21

### Fixed

- Fixed generated npm version and bundle size badges.

## 0.7.7 - 2026-07-21

### Changed

- Refreshed bundled example data and removed the short example data export.

## 0.7.6 - 2026-07-20

### Changed

- Changed value markers to be disabled by default.
- Changed value marker and crosshair labels to use rounded corners by default.

### Fixed

- Kept crosshairs visible while the user scrolls or pans the chart.

## 0.7.5 - 2026-07-19

### Fixed

- Fixed npm version and bundle size badge generation.

## 0.7.4 - 2026-07-19

### Fixed

- Sharpened OHLC bar rendering for crisper canvas output.
- Fixed time crosshair label formatting around daily and weekly intervals.

## 0.7.3 - 2026-07-18

### Changed

- Updated the README demo link.

## 0.7.2 - 2026-07-13

### Fixed

- Exposed the `ChartProps` type in generated package declarations.
- Added package type declaration checks for release validation.

## 0.7.1 - 2026-06-29

### Fixed

- Fixed the package `types` path.

## 0.7.0 - 2026-06-26

### Added

- Added an imperative chart API via `ChartHandle`, including viewport and crosshair controls for external UI integrations. ([#14](https://github.com/trendingcandles/react-candlesticks/pull/14))
- Added an imperative API example chart and README usage documentation. ([#14](https://github.com/trendingcandles/react-candlesticks/pull/14))

### Changed

- Updated chart internals to support controlled imperative viewport/crosshair behavior. ([#14](https://github.com/trendingcandles/react-candlesticks/pull/14))

## 0.6.1 - 2026-06-22

### Added

- Added rounded value marker and boxed value label rendering support. ([#13](https://github.com/trendingcandles/react-candlesticks/pull/13))
- Added a reusable rounded rectangle drawing primitive. ([#13](https://github.com/trendingcandles/react-candlesticks/pull/13))

## 0.6.0 - 2026-06-22

### Added

- Added area chart layers. ([#12](https://github.com/trendingcandles/react-candlesticks/pull/12))
- Added OHLC bar chart layers. ([#12](https://github.com/trendingcandles/react-candlesticks/pull/12))
- Added area and OHLC examples. ([#12](https://github.com/trendingcandles/react-candlesticks/pull/12))

### Changed

- Extended built-in light and dark themes with styling for the new layer types. ([#12](https://github.com/trendingcandles/react-candlesticks/pull/12))

## 0.5.0 - 2026-06-21

### Added

- Added `scaleSmoothing` chart configuration to reduce abrupt y-axis rescaling while panning. ([#11](https://github.com/trendingcandles/react-candlesticks/pull/11))
- Added scale smoothing parsing, metrics smoothing, tests, and example documentation. ([#11](https://github.com/trendingcandles/react-candlesticks/pull/11))

## 0.4.0 - 2026-06-20

### Added

- Added chart-scoped custom indicators through `defineLayer`, with built-in layers refactored onto the same layer-definition path. ([#8](https://github.com/trendingcandles/react-candlesticks/pull/8))
- Added a drawing MVP with custom drawing definitions, drawing registries, hit testing, and drawing interaction support. ([#9](https://github.com/trendingcandles/react-candlesticks/pull/9))
- Added layer hover and click interaction handling across built-in indicator layers. ([#9](https://github.com/trendingcandles/react-candlesticks/pull/9))

### Changed

- Allowed partial custom theme definitions. ([#10](https://github.com/trendingcandles/react-candlesticks/pull/10))
- Refined chart prop naming around drawing/layer configuration. ([#9](https://github.com/trendingcandles/react-candlesticks/pull/9))

## 0.2.1 - 2026-06-13

### Added

- Added CCI, OBV, Parabolic SAR, and Williams %R indicator layers. ([#7](https://github.com/trendingcandles/react-candlesticks/pull/7))

### Changed

- Improved indicator lookback handling. ([#7](https://github.com/trendingcandles/react-candlesticks/pull/7))
- Refactored line indicator drawing to use the shared `drawLineIndicatorLayer` path.
- Switched layers to use `defaultValueLabelFormatter` by default.

## 0.1.3 - 2026-06-12

### Fixed

- Fixed ADX scaling. ([#4](https://github.com/trendingcandles/react-candlesticks/pull/4))

### Changed

- Refactored ADX and line-series layers to use the shared `drawLineSeries` drawing function. ([#5](https://github.com/trendingcandles/react-candlesticks/pull/5))

## 0.1.0 - 2026-06-09

### Added

- Added the ADX indicator layer. ([#3](https://github.com/trendingcandles/react-candlesticks/pull/3))
- Added npm publish workflow setup using OIDC.

### Changed

- Simplified CI matrix and added a workflow timeout.

## 0.0.12 - 2026-05-25

## 0.0.11 - 2026-05-24

### Added

- Added `renderMode="minimal"` for lightweight chart rendering in dense lists and thumbnails. ([#2](https://github.com/trendingcandles/react-candlesticks/pull/2))

## 0.0.10 - 2026-05-23

### Added

- Added `enableScroll` and `enableZoom` props.

## 0.0.9 - 2026-05-23

### Added

- Added chart border configuration.

## 0.0.7 - 2026-05-23

### Added

- Added `initialScrollToLatest` chart prop. ([#1](https://github.com/trendingcandles/react-candlesticks/pull/1))
