// Simple script to generate PNG versions of SVG logos
// Run this in the browser console on the download page

function svgToPng(svgElement, width, height, outputFileName) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = function() {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      
      canvas.toBlob((blob) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = outputFileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        resolve();
      }, 'image/png');
    };
    
    img.src = url;
  });
}

async function downloadPngVersions() {
  const logoImgs = document.querySelectorAll('.logo-preview img');
  
  // Generate logo in different sizes
  const logoSvg = logoImgs[0];
  await svgToPng(logoSvg, 512, 512, 'gox-social-logo-512.png');
  await svgToPng(logoSvg, 256, 256, 'gox-social-logo-256.png');
  await svgToPng(logoSvg, 128, 128, 'gox-social-logo-128.png');
  
  // Generate icon in different sizes
  const iconSvg = logoImgs[1];
  await svgToPng(iconSvg, 512, 512, 'gox-social-icon-512.png');
  await svgToPng(iconSvg, 256, 256, 'gox-social-icon-256.png');
  await svgToPng(iconSvg, 128, 128, 'gox-social-icon-128.png');
  await svgToPng(iconSvg, 64, 64, 'gox-social-icon-64.png');
  await svgToPng(iconSvg, 32, 32, 'gox-social-icon-32.png');
  await svgToPng(iconSvg, 16, 16, 'gox-social-icon-16.png');
  
  console.log('All PNG versions have been downloaded!');
}

// Add button to download page
const container = document.querySelector('.logo-container');
const pngButton = document.createElement('div');
pngButton.className = 'logo-card';
pngButton.style.width = '100%';
pngButton.innerHTML = `
  <h2 class="logo-title">Download PNG Versions</h2>
  <p class="logo-desc">Generate and download PNG versions of the logos in various sizes (16px to 512px).</p>
  <button id="generate-png" class="download-btn">Generate PNG Files</button>
`;
container.appendChild(pngButton);

// Add event listener
document.getElementById('generate-png').addEventListener('click', downloadPngVersions); 