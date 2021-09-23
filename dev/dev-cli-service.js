
const watchDir = require('chokidar');
const path = require('path');
const { fork, exec } = require('child_process');
const dirName = path.join(__dirname, '..');
const Chalk = require('chalk');

const watcher = watchDir.watch(dirName, { ignored: ['**/node_modules', '**/build', '**/debug','**/.idea', '**/dev', '**/.DS_Store'], persistent: true });

function getFileType (dir) {
  return dir.split('.')[dir.split('.').length - 1];
}

function changeJsName(dir) {
  const split = dir.split('/');
  split.splice(split.length - 1, 1);
  return split.join('/') + '/';
}
let isBuilding = false;
let processService = null;


watcher.on('ready', function () {
  console.log(`${dirName}/node_modules/.bin/eslint . --fix`);
  console.log('building code......');
  exec(`${dirName}/node_modules/.bin/eslint . --fix`, function (error, stdout, stderr) {
    if(error) {
      console.log(Chalk.red(error));
      if(processService !== null) processService.kill();
      processService = null;
    } else {
      console.log('Eslint fix done...');
      console.log(`Command: ${dirName}/node_modules/.bin/tsc`);
      exec(`${dirName}/node_modules/.bin/tsc`, function (error, stdout, stderr) {
        if(error) {
          console.log(Chalk.red(stdout));
          if(processService !== null) processService.kill();
          processService = null;
        } else {
          console.log(stdout);
          exec(`cp -r ${dirName}/assets ${dirName}/debug/`);
          processService = fork('./debug/service');
          let url = 'http://localhost',
            port= 3000,
            cmd = '';
          switch (process.platform) {
            case 'win32':
              cmd = 'start';
              break;
            case 'linux':
              cmd = 'xdg-open';
              break;

            case 'darwin':
              cmd = 'open';
              break;
          }
          setTimeout(() => {
            exec(cmd + ' ' + url + ':' + port + '/micro-boot-welcome');
          }, 1000)
        }
      });
    }
  });
});

watcher.on('change', function (path) {
  if(getFileType(path) === 'ts') {
    if(isBuilding) return;
    isBuilding = true;
    const startTime = Date.now();
    if(processService !== null) processService.kill();
    process.stdout.write('\n');
    console.log(`${dirName}/node_modules/.bin/eslint . --fix`);
    console.log('Rebuilding code......');
    exec(`${dirName}/node_modules/.bin/eslint . --fix`, function (error, stdout, stderr) {
      if(error) {
        console.log(Chalk.red(error));
        if(processService !== null) processService.kill();
        processService = null;
      } else {
        console.log('Eslint fix done...');
        console.log(`Command: ${dirName}/node_modules/.bin/tsc`);
        exec(`${dirName}/node_modules/.bin/tsc`, function (error, stdout, stderr) {
          isBuilding = false;
          if(error) {
            console.log(Chalk.red(stdout));
            if(processService !== null) processService.kill();
            processService = null;
          } else {
            exec(`cp -r ${dirName}/assets ${dirName}/debug/`);
            console.log(stdout);
            console.log('Rebuild time:' + (Date.now()/1000 - startTime/1000) + 's');
            processService = fork('./debug/service');
          }
        });
      }
    });


  }
});


