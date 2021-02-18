import { getSuite } from '../../node_modules/just-test/dist/just-test.js'
import { initComponent, ComponentBase } from '../../dist/rich-component.js';

const suite = getSuite({ name: 'Testing externalized templating' });

suite.runTest({ name: 'bad template - null', expectError: 'provided invalid template URL' }, async () => {
	const c = class extends ComponentBase { static get htmlUrl() { return null; } };
	await initComponent('c-a-a', c);
});

suite.runTest({ name: 'bad template - wrong type', expectError: 'provided invalid template URL' }, async () => {
	const c = class extends ComponentBase { static get htmlUrl() { return {}; } };
	await initComponent('c-a-a', c);
});

suite.runTest({ name: 'bad template - bad location', expectError: 'failed to fetch template from' }, async () => {
	const c = class extends ComponentBase { static get htmlUrl() { return './unexisting/path'; } };
	await initComponent('c-a-a', c);
});

suite.runTest({ name: 'bad template - empty content', expectError: 'failed to fetch template from' }, async () => {
	const c = class extends ComponentBase { static get htmlUrl() { return './resources/test-empty-template.htm'; } };
	await initComponent('c-a-a', c);
});

suite.runTest({ name: 'basic e2e' }, async test => {
	const ceTag = `c-${test.getRandom(8).toLowerCase()}`;
	const c = class extends ComponentBase { static get htmlUrl() { return './resources/test-a.htm'; } };
	await initComponent(ceTag, c);

	const ce = document.createElement(ceTag);
	test.assertTrue(ce.matches(':defined'));
	test.assertEqual(3, ce.shadowRoot.childElementCount);
	test.assertEqual('STYLE', ce.shadowRoot.firstElementChild.nodeName);
	test.assertEqual('SPAN', ce.shadowRoot.querySelector('.child-a').nodeName);
});

suite.runTest({ name: 'dynamic template URL' }, async test => {
	const ceTag = `c-${test.getRandom(8).toLowerCase()}`;
	const c = class extends ComponentBase {
		static get htmlUrl() {
			return self => self.getAttribute('data-template-url') || './resources/test-dynamic-url-a.htm';
		}
	};
	await initComponent(ceTag, c);

	const e1 = await new Promise(r => {
		const w = document.createElement('div');
		w.innerHTML = `<${ceTag}></${ceTag}>`;
		w.firstElementChild.addEventListener('templated', () => r(w.firstElementChild));
	});
	test.assertEqual(2, e1.shadowRoot.childElementCount);
	test.assertEqual('STYLE', e1.shadowRoot.firstElementChild.nodeName);
	test.assertEqual('DynUrlA', e1.shadowRoot.querySelector('span').textContent);

	const e2 = await new Promise(r => {
		const w = document.createElement('div');
		w.innerHTML = `<${ceTag} data-template-url="./resources/test-dynamic-url-b.htm"></${ceTag}>`;
		w.firstElementChild.addEventListener('templated', () => r(w.firstElementChild));
	});
	test.assertEqual('DynUrlB', e2.shadowRoot.querySelector('span').textContent);
});

suite.runTest({ name: 'dynamic template URL - negative - null function' }, async test => {
	let e;
	console.error = proxifyNative(console.error, p => {
		e = p;
	});

	const ceTag = `ce-${test.getRandom(8).toLowerCase()}`;
	const c = class extends ComponentBase {
		static get htmlUrl() {
			return () => null;
		}
	};
	await initComponent(ceTag, c);
	document.createElement(ceTag);
	test.assertEqual(`failed to get template for '${ceTag}'`, e);
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