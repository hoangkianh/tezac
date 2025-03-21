const fs = require('fs');
const path = require('path');

// Define the pages we need to create
const pages = [
    { name: 'transfer', title: 'Transfer' },
    { name: 'listing', title: 'Listing' },
    { name: 'cancel-listing', title: 'CancelListing' },
    { name: 'buy', title: 'Buy' },
    { name: 'verify-ownership', title: 'VerifyOwnership' },
    { name: 'bridge', title: 'Bridge' }
];

// Template for page files
const createPageContent = (name, title) => `import AppLayout from '../components/AppLayout';
import ${title}Content from '../../src/pages/${title}';

export default function ${title.replace('-', '')}Page() {
  return (
    <AppLayout>
      <${title}Content />
    </AppLayout>
  );
}`;

// Create the pages
pages.forEach(page => {
    const dirPath = path.join(__dirname, 'app', page.name);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }

    // Create page.tsx file
    const filePath = path.join(dirPath, 'page.tsx');
    fs.writeFileSync(filePath, createPageContent(page.name, page.title));
    console.log(`Created file: ${filePath}`);
});

console.log('All pages created successfully!'); 