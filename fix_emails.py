import os

BASE = r'C:\Users\dell\barada-nextjs'

replacements = {
    'hello@barada.in': 'info@barada.in',
    'partners@barada.in': 'business@partnerschaft.in',
    'privacy@barada.in': 'info@barada.in',
    'legal@barada.in': 'info@barada.in',
}

files = [
    'app/contact/page.tsx',
    'app/privacy/page.tsx',
    'app/terms/page.tsx',
]

for fname in files:
    path = os.path.join(BASE, fname)
    txt = open(path, encoding='utf-8').read()
    for old, new in replacements.items():
        txt = txt.replace(old, new)
    open(path, 'w', encoding='utf-8').write(txt)
    print(f'Updated: {fname}')

print('Done.')
