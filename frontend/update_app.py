import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Remove the old inline Profile component
# It starts around: const Profile = ({ user, setUser, usersList, setUsersList }) => {
# and ends right before: export default function App()
pattern = re.compile(r'const Profile = \(\{ user, setUser, usersList, setUsersList \}\) => \{.*?(?=export default function App\(\))', re.DOTALL)
content = pattern.sub('', content)

# Add import statement at the top if not exists
if "import Profile from './pages/Profile';" not in content:
    content = content.replace("import Login from './pages/auth/Login';", "import Login from './pages/auth/Login';\nimport Profile from './pages/Profile';")

with open('src/App.jsx', 'w') as f:
    f.write(content)
