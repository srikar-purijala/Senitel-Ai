import os
filepath = 'frontend/src/pages/NetworkExplorer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific block
old_block = """                    </div>

                                        </div>

                    <div className="mt-6">"""

new_block = """                    </div>
                    
                    <div className="mt-6">"""

content = content.replace(old_block, new_block)

# Also wrap the whole conditional block in a fragment just in case
content = content.replace("{!isAiLoading && aiAnalysis && (\n                  <div className=\"space-y-4\">", "{!isAiLoading && aiAnalysis && (\n                  <>\n                  <div className=\"space-y-4\">")

content = content.replace("                    </button>\n                  </div>\n                )}", "                    </button>\n                  </div>\n                  </>\n                )}")


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
