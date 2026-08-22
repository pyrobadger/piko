const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const exts = ['.ts', '.tsx', '.json', '.html'];
const dirs = ['src', 'backend', 'manifest.config.ts', 'popup.html', 'index.html'];

dirs.forEach(target => {
  const fullPath = path.resolve(__dirname, target);
  fs.stat(fullPath, (err, stat) => {
    if (err) return;
    if (stat.isDirectory()) {
      walk(fullPath, (err, files) => {
        if (err) throw err;
        files.forEach(processFile);
      });
    } else {
      processFile(fullPath);
    }
  });
});

function processFile(file) {
  if (!exts.includes(path.extname(file)) && !file.endsWith('manifest.config.ts')) return;
  if (file.includes('node_modules') || file.includes('dist')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/ContextPort/g, 'Capy').replace(/contextport/g, 'capy').replace(/Contextport/g, 'Capy');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
}
