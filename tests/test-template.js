import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import { initComponent, ComponentBase } from '../../dist/rich-component.js';

const suite = createSuite({ name: 'Testing inline templating' });

suite.runTest({ name: 'bad template - null', expectError: 'provided invalid template' }, async () => {
	const c = class extends ComponentBase { static get template() { return null; } };
	await initComponent('b-a-a', c);
});

suite.runTest({ name: 'bad template - wrong element', expectError: 'provided invalid template' }, async () => {
	const c = class extends ComponentBase { static get template() { return document.createElement('div'); } };
	await initComponent('b-a-a', c);
});

suite.runTest({ name: 'bad template - wrong element', expectError: 'provided invalid template' }, async () => {
	const c = class extends ComponentBase { static get template() { return document.createElement('div'); } };
	await initComponent('b-a-a', c);
});

suite.runTest({ name: 'basic e2e' }, async test => {
	const t = document.createElement('template');
	t.innerHTML = `
		<style>
			:host {
				display: flex;
			}
		</style>
		<span class="child-a"></span>
		<span class="child-b"></span>
	`;
	const c = class extends ComponentBase { static get template() { return t; } };
	const ceTag = 'b-a-a';
	await initComponent(ceTag, c);

	const ce = document.createElement(ceTag);
	test.assertTrue(ce.matches(':defined'));
	test.assertEqual(3, ce.shadowRoot.childElementCount);
	test.assertEqual('STYLE', ce.shadowRoot.firstElementChild.nodeName);
	test.assertEqual('SPAN', ce.shadowRoot.querySelector('.child-a').nodeName);
});