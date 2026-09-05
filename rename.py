import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content.replace('SENTINEL AI', 'SENTINEL AI')
        new_content = new_content.replace('SENTINEL', 'SENTINEL')
        new_content = new_content.replace('sentinel', 'sentinel')
        new_content = new_content.replace('Sentinel', 'Sentinel')
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        pass

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or '__pycache__' in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx', '.py', '.md', '.json', '.html')):
            replace_in_file(os.path.join(root, file))
