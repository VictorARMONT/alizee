#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const quizDir = path.join(__dirname, "../public/quiz");

async function convertImages() {
  console.log("🖼️  Buscando PNGs en public/quiz...");

  const files = fs.readdirSync(quizDir).filter((f) => f.endsWith(".png"));
  console.log(`Encontrados: ${files.length} PNGs\n`);

  let converted = 0;
  let failed = 0;

  for (const file of files) {
    const inputPath = path.join(quizDir, file);
    const outputPath = path.join(quizDir, file.replace(".png", ".webp"));

    try {
      const stats = fs.statSync(inputPath);
      const inputSize = (stats.size / 1024).toFixed(1);

      await sharp(inputPath)
        .webp({ quality: 80, alphaQuality: 100 })
        .toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      const outputSize = (outputStats.size / 1024).toFixed(1);
      const savings = (((stats.size - outputStats.size) / stats.size) * 100).toFixed(1);

      console.log(`✅ ${file}`);
      console.log(`   ${inputSize} KB → ${outputSize} KB (${savings}% reducción)`);

      converted++;
    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✨ Conversión completada: ${converted} exitosas, ${failed} fallos`);

  // Eliminar PNGs viejos
  if (converted > 0) {
    console.log("\n🗑️  Eliminando PNGs antiguos...");
    for (const file of files) {
      const inputPath = path.join(quizDir, file);
      fs.unlinkSync(inputPath);
      console.log(`   Eliminado: ${file}`);
    }
    console.log("\n✅ PNGs eliminados.\n");
  }
}

convertImages().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
