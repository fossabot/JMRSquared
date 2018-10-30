const fs = require('fs-extra');
const path = require('path');
const {
  execSync
} = require('child_process');
const winston = require('winston-color');

const distPath = path.resolve(__dirname, './dist');

const appPackage = require('./package.json');

function copyNativeScriptPlugins(tplPath, tplPackage) {
  winston.info('Copying NativeScript plugins to template dependencies...');
  const plugins = Object.keys(appPackage.dependencies)
    .filter(key => key.indexOf('nativescript-') !== -1)
    .reduce((obj, key) => {
      obj[key] = appPackage.dependencies[key];
      return obj;
    }, {});
  Object.assign(tplPackage.dependencies, plugins);
  fs.writeFileSync(tplPath + '/package.json', JSON.stringify(tplPackage, null, 2));
}

function updateDistFromTemplate(tplPath) {
  winston.info('Preparing NativeScript application from template...');
  fs.ensureDirSync(distPath);
  fs.copySync(tplPath, distPath, {
    overwrite: false
  });
  execSync('npm i', {
    cwd: 'dist'
  });
}

module.exports = (env) => {
  env.isDev ? winston.warn('Building for dev') : winston.warn('Building for LIVE');
  let tplPath = env.isDev ? path.resolve(__dirname, './template/dev') : path.resolve(__dirname, './template/live');
  let tplPackage = env.isDev ? require('./template/dev/package.json') : require('./template/live/package.json');
  copyNativeScriptPlugins(tplPath, tplPackage);
  updateDistFromTemplate(tplPath);
};