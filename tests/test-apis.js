import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import * as RC from '../../dist/rich-component.js';

const suite = createSuite({ name: 'Testing rich-component APIs' });

suite.runTest({ name: 'API present basic' }, test => {
	test.assertEqual('function', typeof RC.initComponent);
	test.assertEqual('function', typeof RC.ComponentBase);
	test.assertEqual('function', typeof RC.fetchTemplate);
});

suite.runTest({ name: 'initComponent API - undefined tag', expectError: 'invalid element\'s tag\/name:' }, async () => {
	await RC.initComponent();
});

suite.runTest({ name: 'initComponent API - null tag', expectError: 'invalid element\'s tag\/name:' }, async () => {
	await RC.initComponent(null);
});

suite.runTest({ name: 'initComponent API - non-string tag', expectError: 'invalid element\'s tag\/name:' }, async () => {
	await RC.initComponent(function () { });
});

suite.runTest({ name: 'initComponent API - empty-string tag', expectError: 'invalid element\'s tag\/name:' }, async () => {
	await RC.initComponent('');
});

suite.runTest({ name: 'initComponent API - invalid custom element name', expectError: 'invalid element\'s tag\/name:' }, async () => {
	await RC.initComponent('some');
});

suite.runTest({ name: 'initComponent API - undefined class', expectError: 'invalid class for' }, async () => {
	await RC.initComponent('a-a-a');
});

suite.runTest({ name: 'initComponent API - null class', expectError: 'invalid class for' }, async () => {
	await RC.initComponent('a-a-a', null);
});

suite.runTest({ name: 'initComponent API - non-function class', expectError: 'invalid class for' }, async () => {
	await RC.initComponent('a-a-a', {});
});

suite.runTest({ name: 'initComponent API - not ComponentBase extending class', expectError: 'invalid class for' }, async () => {
	const c = class Some { };
	await RC.initComponent('a-a-a', c);
});

suite.runTest({
	name: 'initComponent API - not implementing template/htmlUrl class', expectError: 'MUST implement either static getter of'
}, async () => {
	const c = class Some extends RC.ComponentBase { };
	await RC.initComponent('a-a-a', c);
});

suite.runTest({ name: 'initComponent API - implementing both template/htmlUrl class', expectError: 'MUST implement either static getter of' }, async () => {
	const c = class Some extends RC.ComponentBase { static get template() { return ''; } static get htmlUrl() { return ''; } };
	await RC.initComponent('a-a-a', c);
});

suite.runTest({ name: 'initComponent API - duplicate (to native) definition', expectError: 'element already defined' }, async () => {
	customElements.define('a-a-a', class extends HTMLElement { });

	const c = class Some extends RC.ComponentBase { static get template() { return document.createElement('template'); } };
	await RC.initComponent('a-a-a', c);
});

suite.runTest({ name: 'initComponent API - duplicate (internal) definition', expectError: 'element already defined' }, async () => {
	const c1 = class Some extends RC.ComponentBase { static get template() { return document.createElement('template'); } };
	await RC.initComponent('a-a-b', c1);

	const c2 = class Some extends RC.ComponentBase { static get template() { return document.createElement('template'); } };
	await RC.initComponent('a-a-b', c2);
});