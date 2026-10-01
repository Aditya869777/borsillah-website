import re

with open('components/LiquidFluid.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Strip the fallback HTML injection completely so it doesn't show text if WebGL fails
code = re.sub(r"fallback\.innerHTML\s*=\s*.*?';", "fallback.innerHTML = '';", code, flags=re.DOTALL)

with open('components/LiquidFluid.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Removed fallback text!")
