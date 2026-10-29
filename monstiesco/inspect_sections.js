const fs = require('fs');
const path = require('path');

const dir = 'parsed_sections';
const files = fs.readdirSync(dir);

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  console.log(`=== ${f} === (${content.length} chars)`);
  // print first 300 chars without newlines
  const text = content.replace(/\s+/g, ' ').substring(0, 300);
  console.log(text);
});
