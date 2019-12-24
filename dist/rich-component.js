const
	TEMPLATE_PROPERTY = 'template',
	HTML_URL_PROPERTY = 'htmlUrl',
	componentHTMLs = {};

class ComponentBase extends HTMLElement {
	constructor() {
		super();

		const template = componentHTMLs[this.localName];

		if (!template) {
			console.error(`failed to obtain template for '${this.localName}' by any mean, won't process shadow DOM`);
		} else {
			this.attachShadow({ mode: 'open' })
				.appendChild(template.content.cloneNode(true));
		}
	}
}

export {
	ComponentBase,
	initComponent,
	fetchTemplate
};

async function initComponent(tagName, componentClass) {
	if (componentHTMLs[tagName]) {
		throw new Error(`component MAY NOT be initialized more than once, '${tagName}' is attempted to be initialized more than once`);
	}
	if (!componentClass || !(componentClass.prototype instanceof ComponentBase)) {
		throw new Error(`invalid component class of '${tagName}'; MUST NOT be null and MUST be an instance of ComponentBase`);
	}
	if ((!(TEMPLATE_PROPERTY in componentClass) && !(HTML_URL_PROPERTY in componentClass)) ||
		(TEMPLATE_PROPERTY in componentClass && HTML_URL_PROPERTY in componentClass)) {
		throw new Error(`'${tagName}' MUST implement either static getter of '${HTML_URL_PROPERTY}' property returning component's HTML path, or static getter of '${TEMPLATE_PROPERTY}' property returning a template`);
	}

	let template;
	if (TEMPLATE_PROPERTY in componentClass) {
		template = componentClass[TEMPLATE_PROPERTY];
		if (template.nodeName !== 'TEMPLATE') {
			throw new Error(`'${tagName}' provided invalid template (${template})`);
		}
	} else {
		const templateUrl = componentClass[HTML_URL_PROPERTY];
		if (!templateUrl || typeof templateUrl !== 'string') {
			throw new Error(`'${tagName}' provided invalid HTML URL (${templateUrl})`);
		}

		const templateRaw = await fetchTemplate(templateUrl);
		if (!templateRaw) {
			throw new Error(`failed to init template of '${tagName}' from '${templateUrl}'`)
		}

		template = document.createElement('template');
		template.innerHTML = templateRaw;
	}

	componentHTMLs[tagName] = template;
	customElements.define(tagName, componentClass);
}

async function fetchTemplate(templateUrl) {
	if (!templateUrl || typeof templateUrl !== 'string') {
		throw new Error(`invalid HTML template URL '${templateUrl}'`);
	}

	let result = null;
	const htmlResponse = await fetch(templateUrl);
	if (htmlResponse.ok) {
		const htmlText = await htmlResponse.text();
		if (htmlText) {
			result = htmlText;
		} else {
			console.error(`failed to fetch HTML template from '${templateUrl}', no content`);
		}
	} else {
		console.error(`failed to fetch HTML template from '${templateUrl}', status ${htmlResponse.status}`);
	}
	return result;
}