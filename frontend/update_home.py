import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

original_len = len(content)

# Add import if missing
if "import Home from './pages/Home';" not in content:
    content = content.replace("import Profile from './pages/Profile';", "import Profile from './pages/Profile';\nimport Home from './pages/Home';")

# The inline Home component starts with "const Home = () => ("
# and ends right before "const Login = "
pattern = re.compile(r'const Home = \(\) => \(.*?(?=const Login = )', re.DOTALL)
content = pattern.sub('', content)

print(f"Original length: {original_len}, New length: {len(content)}")

with open('src/App.jsx', 'w') as f:
    f.write(content)
