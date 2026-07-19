const COLOR_LABEL = "#555";
const DEFAULT_ICON_AREA_WIDTH = 0;

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function measureBadgeTextWidth(text) {
  return Math.max(48, Math.round(text.length * 6.8 + 12));
}

export function createBadgeSvg(label, value, color, options = {}) {
  const escapedLabel = escapeXml(label);
  const escapedValue = escapeXml(value);
  const iconSvgBase64 = options.iconSvgBase64;
  const iconAreaWidth = iconSvgBase64 ? 24 : DEFAULT_ICON_AREA_WIDTH;
  const labelTrailingPadding = iconSvgBase64 ? 8 : 0;
  const labelTextAreaWidth = measureBadgeTextWidth(label);
  const labelWidth = iconAreaWidth + labelTextAreaWidth + labelTrailingPadding;
  const valueWidth = measureBadgeTextWidth(value);
  const totalWidth = labelWidth + valueWidth;
  const labelCenter = iconAreaWidth + labelTextAreaWidth / 2;
  const valueCenter = labelWidth + valueWidth / 2;
  const icon = iconSvgBase64
    ? `<image x="5" y="3" width="14" height="14" href="data:image/svg+xml;base64,${iconSvgBase64}"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${escapedLabel}: ${escapedValue}"><title>${escapedLabel}: ${escapedValue}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="${labelWidth}" height="20" fill="${COLOR_LABEL}"/><rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/><rect width="${totalWidth}" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">${icon}<text aria-hidden="true" x="${Math.round(labelCenter * 10)}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${Math.round(labelTextAreaWidth * 10)}">${escapedLabel}</text><text x="${Math.round(labelCenter * 10)}" y="140" transform="scale(.1)" fill="#fff" textLength="${Math.round(labelTextAreaWidth * 10)}">${escapedLabel}</text><text aria-hidden="true" x="${Math.round(valueCenter * 10)}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${Math.round((valueWidth - 12) * 10)}">${escapedValue}</text><text x="${Math.round(valueCenter * 10)}" y="140" transform="scale(.1)" fill="#fff" textLength="${Math.round((valueWidth - 12) * 10)}">${escapedValue}</text></g></svg>`;
}
