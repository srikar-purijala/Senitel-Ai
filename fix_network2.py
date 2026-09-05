import os
filepath = 'frontend/src/pages/NetworkExplorer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("                            <span className=\"text-[11px] font-mono text-[#94a3b8]\">{ev}</span>\n                          </div>", "                            <span className=\"text-[11px] font-mono text-[#94a3b8]\">{ev}</span>\n                          </div>\n                        ))}\n                      </div>\n                      <div>\n                        <p className=\"text-[10px] font-mono text-[#52525b] mb-1\">CONFIDENCE</p>\n                        <p className=\"text-[11px] font-mono text-[#f8fafc] font-bold\">94% - High</p>\n                      </div>\n                      <div>\n                        <p className=\"text-[10px] font-mono text-[#52525b] mb-1\">LIMITATIONS</p>\n                        <p className=\"text-[11px] font-mono text-[#52525b]\">2 entities have insufficient historical data.</p>\n                      </div>")
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
