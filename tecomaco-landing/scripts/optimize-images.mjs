import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const FACTORY_DIR = './public/images/factory';
const CANHAN_DIR = './public/images/canhan';

// Configuration
const THUMBNAIL_WIDTH = 640;  // For gallery grid thumbnails
const FULL_WIDTH = 1280;      // For lightbox / full view
const QUALITY = 80;

async function optimizeImage(inputPath, outputPath, width) {
  const stats = fs.statSync(inputPath);
  const originalSize = (stats.size / 1024).toFixed(0);
  
  await sharp(inputPath)
    .resize(width, null, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toFile(outputPath);
  
  const newStats = fs.statSync(outputPath);
  const newSize = (newStats.size / 1024).toFixed(0);
  const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
  
  console.log(`  ${path.basename(inputPath)}: ${originalSize}KB → ${newSize}KB (${savings}% smaller)`);
}

async function main() {
  console.log('\n🖼️  TecoMaco Image Optimizer\n');
  console.log('='.repeat(50));
  
  // --- FACTORY IMAGES ---
  const factoryFiles = fs.readdirSync(FACTORY_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  
  // Create optimized subdirectories
  const thumbDir = path.join(FACTORY_DIR, 'thumb');
  const fullDir = path.join(FACTORY_DIR, 'full');
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });
  if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });
  
  console.log(`\n📁 Factory Images (${factoryFiles.length} files)\n`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const file of factoryFiles) {
    const inputPath = path.join(FACTORY_DIR, file);
    const stats = fs.statSync(inputPath);
    totalOriginal += stats.size;
    
    // Create thumbnail (640px) for grid view
    const thumbPath = path.join(thumbDir, file);
    console.log(`  [THUMB] ${file}:`);
    await optimizeImage(inputPath, thumbPath, THUMBNAIL_WIDTH);
    
    // Create full-size (1280px) for lightbox
    const fullPath = path.join(fullDir, file);
    console.log(`  [FULL]  ${file}:`);
    await optimizeImage(inputPath, fullPath, FULL_WIDTH);
    
    const thumbStats = fs.statSync(thumbPath);
    const fullStats = fs.statSync(fullPath);
    totalOptimized += thumbStats.size + fullStats.size;
  }
  
  // --- AVATAR IMAGE ---
  console.log(`\n📁 Avatar Image\n`);
  const avatarInput = path.join(CANHAN_DIR, '35x45.jpg');
  if (fs.existsSync(avatarInput)) {
    const avatarOutput = path.join(CANHAN_DIR, '35x45-optimized.jpg');
    await optimizeImage(avatarInput, avatarOutput, 400);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ Optimization Complete!`);
  console.log(`   Original total:  ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Optimized total: ${(totalOptimized / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Saved:           ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%\n`);
  console.log('📌 Next: Update components to use /images/factory/thumb/ and /images/factory/full/ paths\n');
}

main().catch(console.error);
