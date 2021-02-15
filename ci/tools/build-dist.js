import os from 'os';
import fs from 'fs';
import uglifyES from 'uglify-es';

const
	files = [
		'rich-component-class.js',
		'rich-component.js'
	],
	minifyOptions = {
		toplevel: true
	};

process.stdout.write('\x1B[32mSTARTING...\x1B[0m' + os.EOL);

process.stdout.write('cleaning "dist"...');
fs.rmdirSync('dist', { recursive: true });
fs.mkdirSync('dist');
process.stdout.write('\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('building "dist"...');
for (const file of files) {
	fs.copyFileSync(`src/${file}`, `dist/${file}`);
	let pre = fs.readFileSync(`dist/${file}`, { encoding: 'utf-8' });
	pre = pre.replace(/\.js';$/, `.min.js';`);
	const min = uglifyES.minify(pre, minifyOptions).code;
	fs.writeFileSync(`dist/${file.replace(/\.js/, '.min.js')}`, min);
}
process.stdout.write('\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('\x1B[32mDONE\x1B[0m' + os.EOL);