const COLOR_LABEL = "#555";
const DEFAULT_ICON_AREA_WIDTH = 0;
const ICON_AREA_WIDTH = 19;
const ICON_LEFT = 5;
const ICON_SIZE = 14;
const TEXT_HORIZONTAL_PADDING = 10;
const TEXT_SHADOW_Y = 150;
const TEXT_Y = 140;
const FONT_SIZE = 110;

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function measureBadgeTextWidth(text) {
  let width = 0;

  for (const char of String(text)) {
    if (char === " ") width += 3.5;
    else if ("ijl.'".includes(char)) width += 3.2;
    else if ("frt".includes(char)) width += 4.5;
    else if ("mwMW".includes(char)) width += 9.5;
    else if ("%".includes(char)) width += 9.5;
    else if ("0123456789".includes(char)) width += 7;
    else width += 6.8;
  }

  return Math.max(1, Math.ceil(width));
}

export function createBadgeSvg(label, value, color, options = {}) {
  const escapedLabel = escapeXml(label);
  const escapedValue = escapeXml(value);
  const iconSvgBase64 = options.iconSvgBase64;
  const iconAreaWidth = iconSvgBase64 ? ICON_AREA_WIDTH : DEFAULT_ICON_AREA_WIDTH;
  const labelTextWidth = measureBadgeTextWidth(label);
  const valueTextWidth = measureBadgeTextWidth(value);
  const labelWidth = iconAreaWidth + labelTextWidth + TEXT_HORIZONTAL_PADDING;
  const valueWidth = valueTextWidth + TEXT_HORIZONTAL_PADDING;
  const totalWidth = labelWidth + valueWidth;
  const labelCenter = iconAreaWidth + (labelWidth - iconAreaWidth) / 2;
  const valueCenter = labelWidth + valueWidth / 2;
  const icon = iconSvgBase64
    ? `<image x="${ICON_LEFT}" y="3" width="${ICON_SIZE}" height="${ICON_SIZE}" href="data:image/svg+xml;base64,${iconSvgBase64}"/>`
    : "";
  const labelTextLength = Math.round(labelTextWidth * 10);
  const valueTextLength = Math.round(valueTextWidth * 10);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${escapedLabel}: ${escapedValue}"><title>${escapedLabel}: ${escapedValue}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="${labelWidth}" height="20" fill="${COLOR_LABEL}"/><rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/><rect width="${totalWidth}" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="${FONT_SIZE}">${icon}<text aria-hidden="true" x="${Math.round(labelCenter * 10)}" y="${TEXT_SHADOW_Y}" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${labelTextLength}">${escapedLabel}</text><text x="${Math.round(labelCenter * 10)}" y="${TEXT_Y}" transform="scale(.1)" fill="#fff" textLength="${labelTextLength}">${escapedLabel}</text><text aria-hidden="true" x="${Math.round(valueCenter * 10)}" y="${TEXT_SHADOW_Y}" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${valueTextLength}">${escapedValue}</text><text x="${Math.round(valueCenter * 10)}" y="${TEXT_Y}" transform="scale(.1)" fill="#fff" textLength="${valueTextLength}">${escapedValue}</text></g></svg>`;
}
