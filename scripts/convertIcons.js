import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义图标尺寸
const sizes = {
  normal: { width: 20, height: 20 },
  hd: { width: 24, height: 24 }
};

// 定义图标状态
const states = ['on', 'off', 'error', 'unknown'];

// 源文件和目标文件目录
const sourceDir = path.join(__dirname, '../public');
const targetDir = path.join(__dirname, '../public/map_images');

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 转换单个SVG文件为PNG
async function convertSvgToPng(inputFile, outputFile, width, height) {
  try {
    await sharp(inputFile)
      .resize(width, height)
      .png()
      .toFile(outputFile);
    console.log(`转换成功: ${outputFile}`);
  } catch (error) {
    console.error(`转换失败 ${inputFile}:`, error);
  }
}

// 批量转换所有图标
async function convertAllIcons() {
  // 处理普通灯图标
  for (const state of states) {
    const svgFile = path.join(sourceDir, `lamp_${state}.svg`);
    if (fs.existsSync(svgFile)) {
      // 普通版本
      await convertSvgToPng(
        svgFile,
        path.join(targetDir, `lamp_${state}.png`),
        sizes.normal.width,
        sizes.normal.height
      );
      
      // 高清版本
      await convertSvgToPng(
        svgFile,
        path.join(targetDir, `lamp_${state}@2x.png`),
        sizes.hd.width,
        sizes.hd.height
      );
    }
  }

  // 处理告警灯图标
  for (const state of states) {
    const svgFile = path.join(sourceDir, `alarm_lamp_${state}.svg`);
    if (fs.existsSync(svgFile)) {
      // 普通版本
      await convertSvgToPng(
        svgFile,
        path.join(targetDir, `alarm_lamp_${state}.png`),
        sizes.normal.width,
        sizes.normal.height
      );
      
      // 高清版本
      await convertSvgToPng(
        svgFile,
        path.join(targetDir, `alarm_lamp_${state}@2x.png`),
        sizes.hd.width,
        sizes.hd.height
      );
    }
  }
}

// 执行转换
convertAllIcons().then(() => {
  console.log('所有图标转换完成');
}).catch(error => {
  console.error('转换过程中出现错误:', error);
});