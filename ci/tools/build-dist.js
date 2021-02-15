﻿import os from 'os';
import fsExtra from 'fs-extra'
import uglifyES from 'uglify-es';

const
	minifyOptions = {
		toplevel: true
	};

process.stdout.write('\x1B[32mSTARTING...\x1B[0m' + os.EOL);

process.stdout.write('cleaning "dist"...');
fsExtra.emptyDirSync('./dist');
process.stdout.write('\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('building "dist"...');
fsExtra.copySync('./src', './dist');
process.stdout.write('\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('- minifying...');
fsExtra.writeFileSync(
	'./dist/rich-component.min.js',
	uglifyES.minify(fsExtra.readFileSync('./dist/rich-component.js', { encoding: 'utf8' }), minifyOptions).code
);
process.stdout.write('\t\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('\x1B[32mDONE\x1B[0m' + os.EOL);