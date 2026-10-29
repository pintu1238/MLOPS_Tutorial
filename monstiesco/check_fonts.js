const fs = require('fs');

const html = fs.readFileSync('monsties.html', 'utf8');

const fonts = html.match(/@font-face\s*{[^}]+}/gi) || [];
console.log('Font faces count:', fonts.length);
fonts.slice(0, 3).forEach(f => console.log(f));

const fontLinks = html.match(/fonts\.googleapis\.com[^\s"']+/gi) || [];
console.log('Google fonts:', fontLinks);

const fontVariables = html.match(/--font-[^;]+;/gi) || [];
console.log('Font variables:', fontVariables);
