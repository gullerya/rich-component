import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import * as RC from '../../dist/rich-component.js';

const suite = createSuite({ name: 'Testing rich-component APIs' });

suite.runTest({ name: 'API present basic' }, test => {
	test.assertEqual('function', typeof RC.ComponentBase);
	test.assertEqual('function', typeof RC.initComponent);
	test.assertEqual('function', typeof RC.fetchTemplate);
});