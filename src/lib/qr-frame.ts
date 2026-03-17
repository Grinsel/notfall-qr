/**
 * Renders a QR code with the Notfalldose-style green frame on a canvas.
 * The frame design mimics the well-known German emergency info sticker
 * so that first responders instantly recognize the QR code.
 */

const FRAME_GREEN = "#2E7D32";
const FRAME_WHITE = "#FFFFFF";

/**
 * Draw the Notfalldose-style frame around a QR code.
 * Returns a data URL of the composed image.
 *
 * Layout (600x600):
 * - Full green background with rounded corners
 * - White border inset
 * - Top-left: white medical cross
 * - Top-right: white "i" symbol (info)
 * - Center: QR code on white square
 * - Bottom: "Notfall-QR" text
 */
export async function renderQrWithFrame(qrDataUrl: string): Promise<string> {
  const SIZE = 600;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  // Green background
  ctx.fillStyle = FRAME_GREEN;
  roundRect(ctx, 0, 0, SIZE, SIZE, 24);
  ctx.fill();

  // White border inset
  ctx.strokeStyle = FRAME_WHITE;
  ctx.lineWidth = 4;
  roundRect(ctx, 16, 16, SIZE - 32, SIZE - 32, 16);
  ctx.stroke();

  // Medical cross (top-left)
  drawCross(ctx, 52, 42, 72);

  // Info "i" symbol (top-right area)
  drawInfoSymbol(ctx, SIZE - 110, 36, 70);

  // "sos-info.com" vertical text (right side, mimicking original)
  ctx.save();
  ctx.fillStyle = FRAME_WHITE;
  ctx.font = "bold 13px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.translate(SIZE - 34, 180);
  ctx.rotate(Math.PI / 2);
  ctx.fillText("qr.retter.one", 0, 0);
  ctx.restore();

  // QR code in center on white background
  const qrSize = 340;
  const qrX = (SIZE - qrSize) / 2;
  const qrY = 135;

  // White background for QR
  ctx.fillStyle = FRAME_WHITE;
  roundRect(ctx, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 12);
  ctx.fill();

  // Draw QR image
  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // "Notfall-QR" text at bottom
  ctx.fillStyle = FRAME_WHITE;
  ctx.font = "bold 38px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Notfall-QR", SIZE / 2, SIZE - 52);

  // Subtext
  ctx.font = "16px Arial, sans-serif";
  ctx.fillText("Im Notfall scannen", SIZE / 2, SIZE - 24);

  return canvas.toDataURL("image/png");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Draw a white medical cross */
function drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const arm = size / 3;
  ctx.fillStyle = FRAME_WHITE;
  ctx.beginPath();
  // Horizontal bar
  ctx.rect(x, y + arm, size, arm);
  // Vertical bar
  ctx.rect(x + arm, y, arm, size);
  ctx.fill();
}

/** Draw a white info "i" symbol */
function drawInfoSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = FRAME_WHITE;

  // Dot of the "i"
  const dotRadius = size * 0.1;
  const centerX = x + size / 2;
  ctx.beginPath();
  ctx.arc(centerX, y + dotRadius + 2, dotRadius, 0, Math.PI * 2);
  ctx.fill();

  // Body of the "i" — rounded rectangle
  const bodyWidth = size * 0.25;
  const bodyTop = y + dotRadius * 2 + 8;
  const bodyHeight = size - dotRadius * 2 - 10;
  roundRect(ctx, centerX - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight, 3);
  ctx.fill();

  // Serifs (top and bottom horizontal bars)
  const serifWidth = size * 0.5;
  // Top serif
  roundRect(ctx, centerX - serifWidth / 2, bodyTop, serifWidth, 5, 2);
  ctx.fill();
  // Bottom serif
  roundRect(ctx, centerX - serifWidth / 2, bodyTop + bodyHeight - 5, serifWidth, 5, 2);
  ctx.fill();
}
