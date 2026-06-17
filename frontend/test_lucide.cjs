const lucide = require('lucide-react');
const icons = ['Heart', 'Activity', 'MapPin', 'Droplet', 'Users', 'Shield', 'Zap', 'Send', 'FileText', 'Bell', 'ChevronRight', 'Share2'];
for (const icon of icons) {
  if (!lucide[icon]) {
    console.error(`Icon ${icon} is missing!`);
  }
}
console.log('Done checking icons.');
