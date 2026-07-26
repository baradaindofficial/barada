import os

BASE = r'C:\Users\dell\barada-nextjs'

files = [
    'lib/supabase/server.ts',
    'lib/supabase/client.ts',
    'lib/db/learners.ts',
    'lib/db/enrollments.ts',
    'lib/db/progress.ts',
    'context/AuthContext.tsx',
    'middleware.ts',
    'types/database.ts',
    'app/(dashboard)/dashboard/page.tsx',
]

for rel in files:
    path = os.path.join(BASE, rel)
    if os.path.exists(path):
        data = open(path, 'rb').read()
        cleaned = data.decode('utf-8', 'ignore')
        open(path, 'w', encoding='utf-8').write(cleaned)
        print('Clean: ' + rel)
    else:
        print('Not found: ' + rel)

print('All done.')
