import os

path = r'C:\Users\dell\barada-nextjs\app\api\assessments\[id]\attempt\route.ts'
txt = open(path, encoding='utf-8').read()
txt = txt.replace(
    'const { data: attemptRaw } = await supabase\n      .from(\'assessment_attempts\')',
    'const { data: attemptRaw } = await (supabase as any)\n      .from(\'assessment_attempts\')'
)
open(path, 'w', encoding='utf-8').write(txt)
print('Fixed')
