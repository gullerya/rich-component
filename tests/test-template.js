import { getSuite } from '../../node_modules/just-test/dist/just-test.js'
import { initComponent, ComponentBase } from '../../dist/rich-component.js';

const suite = getSuite({ name: 'Testing inline templating' });

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
	const ceTag = `ce-${test.getRandom(8).toLowerCase()}`;
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
	await initComponent(ceTag, c);

	const ce = document.createElement(ceTag);
	test.assertTrue(ce.matches(':defined'));
	test.assertEqual(3, ce.shadowRoot.childElementCount);
	test.assertEqual('STYLE', ce.shadowRoot.firstElementChild.nodeName);
	test.assertEqual('SPAN', ce.shadowRoot.querySelector('.child-a').nodeName);
});

suite.runTest({ name: 'template inline with function' }, async test => {
	const ceTag = `ce-${test.getRandom(8).toLowerCase()}`;
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
	const c = class extends ComponentBase {
		static get template() {
			return self => {
				test.assertTrue(Boolean(self));
				return t;
			};
		}
	};
	await initComponent(ceTag, c);

	const ce = document.createElement(ceTag);
	test.assertTrue(ce.matches(':defined'));
	test.assertEqual(3, ce.shadowRoot.childElementCount);
	test.assertEqual('STYLE', ce.shadowRoot.firstElementChild.nodeName);
	test.assertEqual('SPAN', ce.shadowRoot.querySelector('.child-a').nodeName);
});

suite.runTest({ name: 'dynamic template resolution with function - c~tor time' }, async test => {
	const ceTag = `ce-${test.getRandom(8).toLowerCase()}`;
	const aName = 'data-temp-url';
	const t1 = document.createElement('template');
	t1.innerHTML = `template1`;
	const t2 = document.createElement('template');
	t2.innerHTML = `template2`;
	const c = class extends ComponentBase {
		static get template() {
			return self => {
				const templateId = self.getAttribute(aName);
				return templateId === '2' ? t2 : t1;
			};
		}
	};
	await initComponent(ceTag, c);

	const we1 = document.createElement('div');
	we1.innerHTML = `<${ceTag}></${ceTag}>`;
	test.assertEqual('template1', we1.querySelector(ceTag).shadowRoot.textContent);

	const we2 = document.createElement('div');
	we2.innerHTML = `<${ceTag} ${aName}="2"></${ceTag}>`;
	test.assertEqual('template2', we2.querySelector(ceTag).shadowRoot.textContent);
});