const fs = require('fs');
let code = fs.readFileSync('framer_cursor_real.js', 'utf8');

const idx = code.indexOf('addPropertyControls(Liquid_Fluid');
if (idx > -1) code = code.substring(0, idx);

code = code.replace(/import\s*\{[^}]*\}\s*from\s*['"]framer['"];?/, '');

if (!code.includes('export default')) {
   code = code.replace('export function Liquid_Fluid', 'export default function Liquid_Fluid');
   code = code.replace('function Liquid_Fluid', 'export default function Liquid_Fluid');
}

fs.writeFileSync('components/LiquidFluid.js', code);
console.log('Saved to components/LiquidFluid.js');
