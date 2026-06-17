import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

original_len = len(content)

# Add import if missing
if "import Profile from './pages/Profile';" not in content:
    content = content.replace('import ReCAPTCHA from "react-google-recaptcha"', 'import ReCAPTCHA from "react-google-recaptcha"\nimport Profile from \'./pages/Profile\';')

# The component ends right before "export default App"
pattern = re.compile(r'const Profile = \(\{ user, setUser, usersList, setUsersList \}\) => \{.*?(?=export default App)', re.DOTALL)
content = pattern.sub('', content)

print(f"Original length: {original_len}, New length: {len(content)}")

with open('src/App.jsx', 'w') as f:
    f.write(content)
