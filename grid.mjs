import sharp from 'sharp';
// Raster im Annotations-Koordinatensystem (600x800 viewBox = Foto/2)
const mk = async (src, out) => {
  const lines = [];
  for (let x = 0; x <= 600; x += 50) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="800" stroke="red" stroke-width="${x % 100 === 0 ? 1.5 : 0.5}"/>`);
    if (x % 100 === 0) for (let y = 100; y < 800; y += 100) lines.push(`<text x="${x + 3}" y="${y - 3}" font-size="13" fill="red">${x},${y}</text>`);
  }
  for (let y = 0; y <= 800; y += 50) {
    lines.push(`<line x1="0" y1="${y}" x2="600" y2="${y}" stroke="red" stroke-width="${y % 100 === 0 ? 1.5 : 0.5}"/>`);
  }
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800">${lines.join('')}</svg>`);
  await sharp(src).resize(600, 800).composite([{ input: svg }]).png().toFile(out);
  console.log(out);
};
await mk('public/images/schulstrasse/img_1537.jpg', '/tmp/grid_vorher.png');
await mk('public/images/schulstrasse/img_1683.jpg', '/tmp/grid_nachher.png');
await mk('public/images/schulstrasse/img_1681.jpg', '/tmp/grid_nachher2.png');
