// Canvas shim for Cloudflare Workers (mirrors linkedom's built-in canvas-shim)
class Canvas {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  getContext() {
    return null;
  }
  toDataURL() {
    return '';
  }
}

export function createCanvas(width: number, height: number) {
  return new Canvas(width, height);
}

export default { createCanvas };
