#!/usr/bin/env python3
"""
Fix Sprint 4.3 TypeScript errors:
1. Install @types/jest for test files
2. Fix Set spread in attempt route (use Array.from instead)
3. Exclude test files from main tsconfig, add jest tsconfig
"""
import os
import json

BASE = r'C:\Users\dell\barada-nextjs'

def w(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Fixed: {rel}')

def read(rel):
    path = os.path.join(BASE, rel)
    with open(path, encoding='utf-8') as f:
        return f.read()

# ── Fix 1: Exclude __tests__ from main tsconfig ───────────────────
tsconfig_path = os.path.join(BASE, 'tsconfig.json')
with open(tsconfig_path, encoding='utf-8') as f:
    tsconfig = json.load(f)

# Add __tests__ to exclude so jest globals don't conflict with tsc
exclude = tsconfig.get('exclude', [])
if '__tests__' not in exclude and '**/*.test.ts' not in exclude:
    exclude.append('**/*.test.ts')
    exclude.append('**/*.test.tsx')
    tsconfig['exclude'] = exclude

with open(tsconfig_path, 'w', encoding='utf-8') as f:
    json.dump(tsconfig, f, indent=2)
print('  Fixed: tsconfig.json (excluded test files from tsc)')

# ── Fix 2: tsconfig for tests ─────────────────────────────────────
w('tsconfig.test.json', json.dumps({
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "types": ["jest", "node"]
    },
    "include": ["__tests__/**/*"],
    "exclude": []
}, indent=2))

# ── Fix 3: Fix Set spread in attempt route — use Array.from ───────
attempt_path = os.path.join(BASE, r'app\api\assessments\[id]\attempt\route.ts')
txt = open(attempt_path, encoding='utf-8').read()
txt = txt.replace(
    'const missing = [...questionIds].filter(id => !answeredIds.has(id))',
    'const missing = Array.from(questionIds).filter(id => !answeredIds.has(id))'
)
open(attempt_path, 'w', encoding='utf-8').write(txt)
print('  Fixed: app/api/assessments/[id]/attempt/route.ts (Set iteration)')

print('\nDone. Now install @types/jest:')
print('  npm install --save-dev @types/jest')
print('  Then: npm run type-check')
