import urllib.request
import re

url = 'https://framerusercontent.com/modules/0cTf2Gqj3y1WkR6jP2xL/aP86nmOJy6tPfN0rRzeL/ImageScroller.js'
response = urllib.request.urlopen(url)
content = response.read().decode('utf-8')

idx = content.find('addPropertyControls(')
if idx != -1:
    content = content[:idx]

idx2 = content.find('__FramerMetadata__')
if idx2 != -1:
    content = content[:idx2]

content = re.sub(r'import\s*\{[^}]*\}\s*from\s*"framer";?', '', content)
content = re.sub(r"import\s*\{[^}]*\}\s*from\s*'framer';?", '', content)

if 'export default' not in content:
    content = content.replace('export function ImageScroller', 'export default function ImageScroller')
    content = content.replace('function ImageScroller', 'export default function ImageScroller')

# Since framer might use motion, sometimes we need to strip `import { motion } from "framer-motion"` 
# but usually it's fine if we just install framer-motion.
# Also it uses `import { jsx as _jsx }` from "react/jsx-runtime". That is fine.

with open('components/ImageScroller.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Saved ImageScroller.js')
