const fs = require('fs');
const path = require('path');

// Parameters
const inputFile = process.argv[2]; // e.g., "model_metrics_2025_04_29_03_22_20.json"
const decimals = parseInt(process.argv[3] || '4', 10); // e.g., 4

if (!inputFile) {
  console.error('Usage: node round_json.js <input_file> [decimals]');
  process.exit(1);
}

// Generate output file name automatically
const { dir, name, ext } = path.parse(inputFile);
const outputFile = path.join(dir, `${name}_rounded${ext}`);

// Helper to recursively round floats
function roundFloats(obj, decimals) {
  if (Array.isArray(obj)) {
    return obj.map((item) => roundFloats(item, decimals));
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = roundFloats(value, decimals);
    }
    return newObj;
  } else if (typeof obj === 'number') {
    return Number(obj.toFixed(decimals));
  } else {
    return obj;
  }
}

// Main
try {
  const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const roundedData = roundFloats(data, decimals);
  fs.writeFileSync(outputFile, JSON.stringify(roundedData, null, 2));
  console.log(`Rounded JSON saved to ${outputFile}`);
} catch (error) {
  console.error('Error:', error.message);
}
