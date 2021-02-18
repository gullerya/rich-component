import { getSuite } from '../../node_modules/just-test/dist/just-test.js'
import { fetchTemplate } from '../../dist/rich-component.js';

const suite = getSuite({ name: 'Testing fetch template' });

suite.runTest({ name: 'bad url - undefined', expectError: 'invalid template URL' }, async () => {
	await fetchTemplate();
});

suite.runTest({ name: 'bad url - null', expectError: 'invalid template URL' }, async () => {
	await fetchTemplate(null);
});

suite.runTest({ name: 'bad url - not a string', expectError: 'invalid template URL' }, async () => {
	await fetchTemplate({});
});

suite.runTest({ name: 'bad url - empty string', expectError: 'invalid template URL' }, async () => {
	await fetchTemplate('');
});

suite.runTest({ name: 'bad url - 404', expectError: `failed to fetch template from './non/existing/resource'` }, async () => {
	await fetchTemplate('./non/existing/resource');
});

suite.runTest({ name: 'bad url - empty content', expectError: 'failed to fetch template from' }, async () => {
	await fetchTemplate('./resources/test-empty-template.htm');
});

suite.runTest({ name: 'basic e2e' }, async test => {
	const t = await fetchTemplate('./resources/test-a.htm');
	test.assertEqual('object', typeof t);
	test.assertEqual(1, t.nodeType);
	test.assertEqual('TEMPLATE', t.nodeName);
	test.assertEqual('object', typeof t.content);
	test.assertEqual(3, t.content.childElementCount);
});

suite.runTest({ name: 'same url fetched only once' }, async test => {
	let callCounts = 0;
	globalThis.fetch = proxifyNative(globalThis.fetch, () => {
		callCounts++;
	});
	fetchTemplate('./resources/test-b.htm');
	test.assertEqual(1, callCounts);
	fetchTemplate('./resources/test-b.htm');
	test.assertEqual(1, callCounts);
});

suite.runTest({ name: 'same url fetched anew if force is true' }, async test => {
	let callCounts = 0;
	globalThis.fetch = proxifyNative(globalThis.fetch, () => {
		callCounts++;
	});
	fetchTemplate('./resources/test-c.htm');
	test.assertEqual(1, callCounts);
	fetchTemplate('./resources/test-c.htm', true);
	test.assertEqual(2, callCounts);
});

function proxifyNative(native, proxy) {
	return args => {
		try {
			proxy.call(this, args);
		} catch (e) {
			console.error(e);
		}
		return native.call(this, args);
	};
}