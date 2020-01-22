import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import { initComponent, ComponentBase } from '../../dist/rich-component.js';

const
	suite = createSuite({ name: 'Testing different DOM types' }),
	template = document.createElement('template');

template.innerHTML = '<span class="test"></span>';

suite.runTest({ name: 'no domType (default is shadow)' }, async test => {
	const c = class extends ComponentBase {
		static get template() { return template; }
	};
	await initComponent('d-a-a', c);
	const e = document.createElement('d-a-a');
	test.assertTrue(typeof e.shadowRoot === 'object' && e.shadowRoot !== null);
	test.assertTrue(e.shadowRoot.querySelector('.test').nodeType === Node.ELEMENT_NODE);
});

suite.runTest({ name: 'explicit shadow' }, async test => {
	const c = class extends ComponentBase {
		static get template() { return template; }
		static get domType() { return 'shadow'; }
	};
	await initComponent('d-a-b', c);
	const e = document.createElement('d-a-b');
	test.assertTrue(typeof e.shadowRoot === 'object' && e.shadowRoot !== null);
	test.assertTrue(e.shadowRoot.querySelector('.test').nodeType === Node.ELEMENT_NODE);
});

suite.runTest({ name: 'explicit light' }, async test => {
	const c = class extends ComponentBase {
		static get template() { return template; }
		static get domType() { return 'light'; }
	};
	await initComponent('d-a-c', c);
	const e = document.createElement('d-a-c');
	document.body.appendChild(e);
	test.assertTrue(typeof e.shadowRoot === 'object' && e.shadowRoot === null);
	test.assertTrue(e.querySelector('.test').nodeType === Node.ELEMENT_NODE);
});