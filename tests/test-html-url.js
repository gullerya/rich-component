import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import { initComponent, ComponentBase } from '../../dist/rich-component.js';

const suite = createSuite({ name: 'Testing externalized templating' });

suite.runTest({ name: 'bad template - null', expectError: 'provided invalid HTML URL' }, async () => {
	const c = class extends ComponentBase { static get htmlUrl() { return null; } };
	await initComponent('c-a-a', c);
});

suite.runTest({ name: 'bad template - wrong type', expectError: 'provided invalid HTML URL' }, async () => {
	const c = class extends ComponentBase { static get htmlUrl() { return {}; } };
	await initComponent('c-a-a', c);
});

suite.runTest({ name: 'bad template - bad location', expectError: 'failed to init template of' }, async () => {
	const c = class extends ComponentBase { static get htmlUrl() { return './unexisting/path'; } };
	await initComponent('c-a-a', c);
});

suite.runTest({ name: 'bad template - empty content', expectError: 'failed to init template of' }, async () => {
	const c = class extends ComponentBase { static get htmlUrl() { return './resources/test-empty-template.htm'; } };
	await initComponent('c-a-a', c);
});

suite.runTest({ name: 'basic e2e' }, async test => {
	const c = class extends ComponentBase { static get htmlUrl() { return './resources/test-a.htm'; } };
	const ceTag = 'c-a-a';
	await initComponent(ceTag, c);

	const ce = document.createElement(ceTag);
	test.assertTrue(ce.matches(':defined'));
	test.assertEqual(3, ce.shadowRoot.childElementCount);
	test.assertEqual('STYLE', ce.shadowRoot.firstElementChild.nodeName);
	test.assertEqual('SPAN', ce.shadowRoot.querySelector('.child-a').nodeName);
});