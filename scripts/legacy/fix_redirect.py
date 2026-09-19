import json, os

path = r'C:\Users\dell\barada-nextjs\vercel.json'
data = json.load(open(path))

# Remove any redirect where source equals destination (self-redirect loop)
before = len(data.get('redirects', []))
data['redirects'] = [
    r for r in data.get('redirects', [])
    if r.get('source') != r.get('destination')
]
after = len(data['redirects'])

open(path, 'w').write(json.dumps(data, indent=2))
print(f'Fixed: removed {before - after} bad redirect(s)')
print('Remaining redirects:', data['redirects'])
