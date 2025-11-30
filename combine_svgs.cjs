const fs = require('fs');
const path = require('path');

const checkerPath = path.join(__dirname, 'public', 'checker-red.svg');
const crownPath = path.join(__dirname, 'public', "King's_Crown.svg");
const outputPath = path.join(__dirname, 'public', 'test-king-crown.svg');

try {
  let checkerContent = fs.readFileSync(checkerPath, 'utf8');
  let crownContent = fs.readFileSync(crownPath, 'utf8');

  const crownBodyMatch = crownContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!crownBodyMatch) {
    console.error('Could not parse crown SVG structure');
    process.exit(1);
  }

  let crownBody = crownBodyMatch[1];

  const scale = 0.42;
  const perspectiveScaleY = 0.6;

  const crownTranslateX = 60 - (238 * scale) / 2;
  const crownTranslateY = 0;

  const crownGroup = `
    <g id="kings-crown" transform="translate(${crownTranslateX}, ${crownTranslateY}) scale(${scale}, ${scale * perspectiveScaleY})">
      ${crownBody}
    </g>
  `;

  let newContent = checkerContent.replace(
    '<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">',
    '<svg width="120" height="180" viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg">'
  );

  const checkerBodyMatch = checkerContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!checkerBodyMatch) {
    console.error('Could not parse checker SVG structure');
    process.exit(1);
  }
  const checkerBody = checkerBodyMatch[1];

  const shiftedContent = `
  <g transform="translate(0, 50)">
    ${checkerBody}
    ${crownGroup}
  </g>
  `;

  newContent = newContent.replace(checkerBody, shiftedContent);

  fs.writeFileSync(outputPath, newContent);
  console.log('Successfully created test-king-crown.svg');

} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
