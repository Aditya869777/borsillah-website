import urllib.request
import re

url = 'https://framerusercontent.com/modules/C6f8ZlQLp4jRS972340v/ClrdJmZ1hxsmUPHsuz0T/Liquid_Fluid.js'
response = urllib.request.urlopen(url)
content = response.read().decode('utf-8')

idx = content.find('addPropertyControls(Liquid_Fluid')
if idx != -1:
    content = content[:idx]

content = re.sub(r'import\s*\{[^}]*\}\s*from\s*"framer";?', '', content)
content = re.sub(r"import\s*\{[^}]*\}\s*from\s*'framer';?", '', content)

if 'export default' not in content:
    content = content.replace('export function Liquid_Fluid', 'export default function Liquid_Fluid')
    content = content.replace('function Liquid_Fluid', 'export default function Liquid_Fluid')

with open('components/LiquidFluid.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Clean UTF-8 saved!', len(content))
