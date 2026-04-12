import fs from 'fs';
import path from 'path';

// Read and evaluate each modules file
const modules_1_3_content = fs.readFileSync('./src/content/modules_1_3.js', 'utf8');
const modules_4_6_content = fs.readFileSync('./src/content/modules_4_6.js', 'utf8');
const modules_7_9_content = fs.readFileSync('./src/content/modules_7_9.js', 'utf8');

// Extract arrays using regex
const extract_modules_1_3 = eval(modules_1_3_content.split('export const modules_1_3 = ')[1]);
const extract_modules_4_6 = eval(modules_4_6_content.split('export const modules_4_6 = ')[1]);
const extract_modules_7_9 = eval(modules_7_9_content.split('export const modules_7_9 = ')[1]);

const allModules = [
  { id: 'module1-pytorch-mps', module: extract_modules_1_3[0] },
  { id: 'module2-autograd', module: extract_modules_1_3[1] },
  { id: 'module3-nn-module', module: extract_modules_1_3[2] },
  { id: 'module4-building-blocks', module: extract_modules_4_6[0] },
  { id: 'module5-attention', module: extract_modules_4_6[1] },
  { id: 'module6-transformer', module: extract_modules_4_6[2] },
  { id: 'module7-training', module: extract_modules_7_9[0] },
  { id: 'module8-modern-arch', module: extract_modules_7_9[1] },
  { id: 'module9-moe-mla', module: extract_modules_7_9[2] }
];

// Create modules directory if it doesn't exist
const modulesDir = './src/content/modules';
if (!fs.existsSync(modulesDir)) {
  fs.mkdirSync(modulesDir, { recursive: true });
}

// Write each module as a JSON file
for (const { id, module } of allModules) {
  const filename = `${modulesDir}/${id}.json`;
  fs.writeFileSync(filename, JSON.stringify(module, null, 2));
  console.log(`Created: ${filename}`);
}

console.log('\nModule extraction complete!');
