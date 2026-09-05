import os
import re

filepath = 'frontend/src/pages/NetworkExplorer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Try to find the broken JSX and replace it safely
pattern = r"\{'6 accounts share 2 devices'.*?0\{i \+ 1\}.*?\{ev\}</span>\s*</div>"
replacement = "{['6 accounts share 2 devices', '4 accounts share an IP range', 'Transaction velocity +4.2x', 'Cluster formed in 38 minutes'].map((ev, i) => (<div key={i} className=\"flex items-start gap-2 mb-1\"><span className=\"text-primary font-mono text-[10px] shrink-0 mt-0.5\">0{i + 1}</span><span className=\"text-[11px] font-mono text-[#94a3b8]\">{ev}</span></div>))}"

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
