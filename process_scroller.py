import re

with open('components/ImageScroller_raw.js', 'r', encoding='utf-8') as f:
    content = f.read()

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

with open('components/ImageScroller.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Saved ImageScroller.js')
