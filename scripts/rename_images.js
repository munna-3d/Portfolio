
const fs = require('fs');
const path = require('path');

const dir = 'public/sequence';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));

files.sort((a, b) => {
    const numA = parseInt(a.match(/frame_(\d+)/)[1]);
    const numB = parseInt(b.match(/frame_(\d+)/)[1]);
    return numA - numB;
});

files.forEach((file, index) => {
    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, `frame_${index.toString().padStart(3, '0')}.webp`);
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${file} to ${path.basename(newPath)}`);
});
