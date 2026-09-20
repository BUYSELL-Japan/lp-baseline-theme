import fs from 'fs';
fetch('http://localhost:4321/demo/shiro')
  .then(res => res.text())
  .then(text => {
    fs.writeFileSync('shiro_output.html', text);
    console.log('Saved to shiro_output.html');
  })
  .catch(err => console.error(err));
