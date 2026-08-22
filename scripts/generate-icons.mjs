/**
 * Script to generate PNG icons from SVG.
 * Run with: node scripts/generate-icons.mjs
 *
 * For now, we create simple canvas-based icons that match the SVG design.
 */

import { writeFileSync } from 'fs';
import { createCanvas } from 'canvas'; // Only needed if you have 'canvas' package

// For a zero-dependency approach, we'll create a simple HTML file
// that can be opened in Chrome to render and download the icons.
const html = `<!DOCTYPE html>
<html>
<head><title>ContextPort Icon Generator</title></head>
<body>
<h1>ContextPort Icon Generator</h1>
<p>Right-click each canvas and "Save image as..."</p>
<div id="icons"></div>
<script>
const sizes = [16, 48, 128];
const container = document.getElementById('icons');

sizes.forEach(size => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background with gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#7C3AED');
  grad.addColorStop(1, '#5B21B6');
  
  // Rounded rect
  const r = size * 0.22;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Document icon
  const s = size / 128;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.moveTo(42*s, 24*s);
  ctx.lineTo(70*s, 24*s);
  ctx.lineTo(92*s, 46*s);
  ctx.lineTo(92*s, 104*s);
  ctx.quadraticCurveTo(92*s, 108*s, 88*s, 108*s);
  ctx.lineTo(42*s, 108*s);
  ctx.quadraticCurveTo(38*s, 108*s, 38*s, 104*s);
  ctx.lineTo(38*s, 28*s);
  ctx.quadraticCurveTo(38*s, 24*s, 42*s, 24*s);
  ctx.closePath();
  ctx.fill();

  // Arrow
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(1, 5 * s);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  ctx.moveTo(64*s, 90*s);
  ctx.lineTo(64*s, 58*s);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(50*s, 72*s);
  ctx.lineTo(64*s, 58*s);
  ctx.lineTo(78*s, 72*s);
  ctx.stroke();

  // Label
  const label = document.createElement('div');
  label.style.margin = '20px 0';
  label.innerHTML = '<h3>icon-' + size + '.png</h3>';
  label.appendChild(canvas);
  
  // Auto-download link
  const link = document.createElement('a');
  link.download = 'icon-' + size + '.png';
  link.href = canvas.toDataURL('image/png');
  link.textContent = ' Download';
  label.appendChild(link);
  
  container.appendChild(label);
});
</script>
</body>
</html>`;

writeFileSync('icon-generator.html', html);
console.log('Open icon-generator.html in Chrome to generate icons.');
