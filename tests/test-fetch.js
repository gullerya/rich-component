import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import { fetchTemplate } from '../../dist/rich-component.js';

const suite = createSuite({ name: 'Testing fetch template' });

suite.runTest({ name: 'bad url - undefined', expectError: 'invalid HTML template URL' }, async () => {
	await fetchTemplate();
});

suite.runTest({ name: 'bad url - null', expectError: 'invalid HTML template URL' }, async () => {
	await fetchTemplate(null);
});

suite.runTest({ name: 'bad url - not a string', expectError: 'invalid HTML template URL' }, async () => {
	await fetchTemplate({});
});

suite.runTest({ name: 'bad url - empty string', expectError: 'invalid HTML template URL' }, async () => {
	await fetchTemplate('');
});

suite.runTest({ name: 'bad url - 404', sync: true }, async test => {
	const originalConsoleError = console.error;
	const errorLogs = [];
	console.error = m => errorLogs.push(m);

	await fetchTemplate('./non/existing/resource');
	test.assertTrue(errorLogs.length > 0);
	test.assertTrue(errorLogs.some(l => l.indexOf(`failed to fetch HTML template from './non/existing/resource'`) >= 0));

	console.error = originalConsoleError;
});

suite.runTest({ name: 'bad url - empty content', sync: true }, async test => {
	const originalConsoleError = console.error;
	const errorLogs = [];
	console.error = m => errorLogs.push(m);

	await fetchTemplate('./resources/test-empty-template.htm');
	test.assertTrue(errorLogs.length > 0);
	test.assertTrue(errorLogs.some(l => l.indexOf('failed to fetch HTML template from') >= 0));

	console.error = originalConsoleError;
});

suite.runTest({ name: 'basic e2e' }, async test => {
	const t = await fetchTemplate('./resources/test-a.htm');
	test.assertEqual('string', typeof t);
	test.assertTrue(t.length > 0);
});