import os
filepath = 'frontend/src/pages/NetworkExplorer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('navigate(\\/investigations\\)', "navigate('/investigations')")
content = content.replace('navigate(\\\/investigations\\\)', "navigate('/investigations')")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
