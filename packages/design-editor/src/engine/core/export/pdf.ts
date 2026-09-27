/** One-page PDF around a single raster image, with optional trim box and crop marks. */

export interface PdfImage {
  /** Pixel size */
  width: number;
  height: number;
  /** JPEG bytes (`DCTDecode`) or zlib-compressed 8-bit RGB (`FlateDecode`) */
  data: Uint8Array;
  filter: 'DCTDecode' | 'FlateDecode';
  /** zlib-compressed 8-bit alpha, used as a soft mask */
  alpha?: Uint8Array;
}

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PdfPage {
  /** Placed image size in points; this is the bleed box */
  width: number;
  height: number;
  /** Trim lines inset from the image edges, in points */
  trim?: Insets;
  cropMarks?: boolean;
  title?: string;
}

/** Gap between the bleed edge and a crop mark, and the mark length, in points */
export const CROP_MARK_GAP = 6;
export const CROP_MARK_LENGTH = 18;

const num = (value: number) => {
  const fixed = value.toFixed(3);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
};

const box = (x0: number, y0: number, x1: number, y1: number) =>
  `[${num(x0)} ${num(y0)} ${num(x1)} ${num(y1)}]`;

const pdfString = (text: string) =>
  `(${text.replace(/[\\()]/g, (c) => `\\${c}`).replace(/[^\x20-\x7e]/g, '?')})`;

function cropMarks(
  margin: number,
  width: number,
  height: number,
  trim: Insets
): string {
  const near = margin - CROP_MARK_GAP;
  const far = near - CROP_MARK_LENGTH;
  const right = margin + width + CROP_MARK_GAP;
  const top = margin + height + CROP_MARK_GAP;
  const xs = [margin + trim.left, margin + width - trim.right];
  const ys = [margin + trim.bottom, margin + height - trim.top];
  const line = (x0: number, y0: number, x1: number, y1: number) =>
    `${num(x0)} ${num(y0)} m ${num(x1)} ${num(y1)} l S`;
  return [
    'q 0.25 w 1 1 1 1 K',
    ...xs.flatMap((x) => [
      line(x, far, x, near),
      line(x, top, x, top + CROP_MARK_LENGTH),
    ]),
    ...ys.flatMap((y) => [
      line(far, y, near, y),
      line(right, y, right + CROP_MARK_LENGTH, y),
    ]),
    'Q',
  ].join('\n');
}

export function buildPdf(image: PdfImage, page: PdfPage): Uint8Array {
  const encoder = new TextEncoder();
  const trim = page.trim ?? { top: 0, right: 0, bottom: 0, left: 0 };
  const margin = page.cropMarks ? CROP_MARK_GAP + CROP_MARK_LENGTH : 0;
  const mediaWidth = page.width + margin * 2;
  const mediaHeight = page.height + margin * 2;

  let content = `q ${num(page.width)} 0 0 ${num(page.height)} ${num(margin)} ${num(margin)} cm /Im0 Do Q`;
  if (page.cropMarks) {
    content += `\n${cropMarks(margin, page.width, page.height, trim)}`;
  }
  const contentBytes = encoder.encode(content);

  const hasAlpha = Boolean(image.alpha);
  const imageId = 5;
  const maskId = 6;
  const infoId = hasAlpha ? 7 : 6;

  const objects: (string | [string, Uint8Array])[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    [
      '<< /Type /Page /Parent 2 0 R',
      `/MediaBox ${box(0, 0, mediaWidth, mediaHeight)}`,
      `/BleedBox ${box(margin, margin, margin + page.width, margin + page.height)}`,
      `/TrimBox ${box(
        margin + trim.left,
        margin + trim.bottom,
        margin + page.width - trim.right,
        margin + page.height - trim.top
      )}`,
      `/Resources << /XObject << /Im0 ${imageId} 0 R >> >>`,
      '/Contents 4 0 R >>',
    ].join('\n'),
    [`<< /Length ${contentBytes.length} >>`, contentBytes],
    [
      [
        '<< /Type /XObject /Subtype /Image',
        `/Width ${image.width} /Height ${image.height}`,
        '/ColorSpace /DeviceRGB /BitsPerComponent 8',
        `/Filter /${image.filter}`,
        hasAlpha ? `/SMask ${maskId} 0 R` : '',
        `/Length ${image.data.length} >>`,
      ]
        .filter(Boolean)
        .join('\n'),
      image.data,
    ],
  ];

  if (image.alpha) {
    objects.push([
      [
        '<< /Type /XObject /Subtype /Image',
        `/Width ${image.width} /Height ${image.height}`,
        '/ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode',
        `/Length ${image.alpha.length} >>`,
      ].join('\n'),
      image.alpha,
    ]);
  }

  objects.push(
    `<< /Producer (design-editor)${page.title ? ` /Title ${pdfString(page.title)}` : ''} >>`
  );

  const chunks: Uint8Array[] = [];
  let length = 0;
  const push = (chunk: string | Uint8Array) => {
    const bytes = typeof chunk === 'string' ? encoder.encode(chunk) : chunk;
    chunks.push(bytes);
    length += bytes.length;
  };

  // The binary comment marks the file as binary for transfer tools.
  push('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n');
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets.push(length);
    push(`${index + 1} 0 obj\n`);
    if (typeof object === 'string') {
      push(`${object}\nendobj\n`);
    } else {
      push(`${object[0]}\nstream\n`);
      push(object[1]);
      push('\nendstream\nendobj\n');
    }
  });

  const xrefOffset = length;
  push(
    [
      'xref',
      `0 ${objects.length + 1}`,
      '0000000000 65535 f ',
      ...offsets.map(
        (offset) => `${String(offset).padStart(10, '0')} 00000 n `
      ),
      'trailer',
      `<< /Size ${objects.length + 1} /Root 1 0 R /Info ${infoId} 0 R >>`,
      'startxref',
      String(xrefOffset),
      '%%EOF\n',
    ].join('\n')
  );

  const out = new Uint8Array(length);
  let at = 0;
  chunks.forEach((chunk) => {
    out.set(chunk, at);
    at += chunk.length;
  });
  return out;
}
