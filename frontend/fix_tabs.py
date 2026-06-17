import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Replace container gap and padding
content = content.replace(
    "display: 'flex', gap: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '24px'",
    "display: 'flex', gap: '0.5rem', background: '#ffffff', padding: '0.75rem', borderRadius: '24px', flexWrap: 'wrap', justifyContent: 'center'"
)

# Replace button paddings, fonts, and gaps
content = content.replace("padding: '0.875rem 1.5rem'", "padding: '0.75rem 1rem'")
content = content.replace("fontSize: '0.9rem'", "fontSize: '0.85rem'")
content = content.replace("gap: '0.5rem'", "gap: '0.4rem'")

with open('src/App.jsx', 'w') as f:
    f.write(content)
