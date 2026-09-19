import os

BASE = r'C:\Users\dell\barada-nextjs'
path = os.path.join(BASE, 'app', '(dashboard)', 'dashboard', 'page.tsx')

content = open(path).read()
content = content.replace(
    'enrollments.map(e => ({',
    'enrollments.map((e: any) => ({'
)
content = content.replace(
    '})).filter(x => x.course)',
    '})).filter((x: any) => x.course)'
)
content = content.replace(
    'enrolledCourses.map(({ enrollment, course }) => (',
    'enrolledCourses.map(({ enrollment, course }: any) => ('
)
open(path, 'w').write(content)
print('Fixed: dashboard/page.tsx')
