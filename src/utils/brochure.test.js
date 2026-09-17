import { CARD, brochureCardPosition, formatBrochurePrice, resolveBrochureImage, loadBrochureImage } from "./brochure";

jest.mock("jspdf", () => ({ jsPDF: jest.fn() }));
test("primary image wins, otherwise first stored image is used", () => {
  expect(resolveBrochureImage({ imageUrl: "/primary.jpg", images: ["/other.jpg"] })).toBe("/primary.jpg");
  expect(resolveBrochureImage({ images: ["", "/first.jpg"] })).toBe("/first.jpg");
  expect(resolveBrochureImage({})).toBe("");
});
test("prices use Naira and authoritative numeric values without malformed output", () => {
  expect(formatBrochurePrice(9500)).toBe("\u20a69,500");
  expect(formatBrochurePrice(120000)).toBe("\u20a6120,000");
  expect(formatBrochurePrice(1250.5)).toBe("\u20a61,250.5");
  expect(formatBrochurePrice("invalid")).toBe("Price on request");
});
test("all products paginate into fixed two-column cards without splitting", () => {
  for (let index = 0; index < 100; index++) {
    const position = brochureCardPosition(index);
    expect(position.page).toBe(2 + Math.floor(index / 4));
    expect(position.x).toBe(index % 2 ? 110 : 14);
    expect(position.x + CARD.width).toBeLessThanOrEqual(196);
    expect(position.y + CARD.height).toBeLessThanOrEqual(262);
    expect(position.y).toBe(brochureCardPosition(index - index % 2).y);
  }
});
test("missing image resolves gracefully and identifies the affected product", async () => {
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  expect(await loadBrochureImage("", "Chair 123")).toBeNull();
  expect(warn).toHaveBeenCalledWith("Brochure image missing:", "Chair 123");
  warn.mockRestore();
});

test("image loading requests CORS and waits for decoding before producing PDF image data", async () => {
  const OriginalImage = global.Image;
  let image, decode;
  global.Image = class {
    constructor() { image = this; this.naturalWidth = 2400; this.naturalHeight = 1200; }
    decode() { return new Promise(resolve => { decode = resolve; }); }
  };
  const context = { fillRect: jest.fn(), drawImage: jest.fn() };
  const getContext = jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  const dataUrl = jest.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,test");
  try {
    let settled = false;
    const pending = loadBrochureImage("/product.jpg", "Chair").then(value => { settled = true; return value; });
    expect(image.crossOrigin).toBe("anonymous");
    expect(image.src).toBe(`${window.location.origin}/product.jpg`);
    const loading = image.onload();
    await Promise.resolve();
    expect(settled).toBe(false);
    decode();
    await loading;
    expect(await pending).toEqual({ data: "data:image/jpeg;base64,test", width: 1200, height: 600 });
    expect(dataUrl).toHaveBeenCalledWith("image/jpeg", 0.92);
  } finally { global.Image = OriginalImage; getContext.mockRestore(); dataUrl.mockRestore(); }
});

test("a stalled image times out gracefully instead of blocking every download", async () => {
  jest.useFakeTimers();
  const OriginalImage = global.Image;
  global.Image = class {};
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  try {
    const pending = loadBrochureImage("/stalled.jpg", "Stalled chair");
    jest.advanceTimersByTime(25000);
    expect(await pending).toBeNull();
    expect(warn).toHaveBeenCalledWith("Brochure image could not be loaded:", "Stalled chair", "/stalled.jpg");
  } finally { global.Image = OriginalImage; warn.mockRestore(); jest.useRealTimers(); }
});
