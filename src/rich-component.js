const
	TEMPLATE_PROPERTY = 'template',
	HTML_URL_PROPERTY = 'htmlUrl',
	componentHTMLs = {};

class ComponentBase extends HTMLElement {
	constructor() {
		super();

		const template = componentHTMLs[this.localName];
		this.attachShadow({ mode: 'open' })
			.appendChild(template.content.cloneNode(true));
	}
}

export {
	ComponentBase,
	initComponent,
	fetchTemplate
};

async function initComponent(tag, type) {
	validataTag(tag);
	validateType(tag, type);

	let template;
	if (TEMPLATE_PROPERTY in type) {
		template = type[TEMPLATE_PROPERTY];
		if (!template || template.nodeName !== 'TEMPLATE') {
			throw new Error(`'${tag}' provided invalid template: ${template}`);
		}
	} else {
		const templateUrl = type[HTML_URL_PROPERTY];
		if (!templateUrl || typeof templateUrl !== 'string') {
			throw new Error(`'${tag}' provided invalid HTML URL: ${templateUrl}`);
		}

		const templateRaw = await fetchTemplate(templateUrl);
		if (!templateRaw) {
			throw new Error(`failed to init template of '${tag}' from '${templateUrl}'`)
		}

		template = document.createElement('template');
		template.innerHTML = templateRaw;
	}

	componentHTMLs[tag] = template;
	customElements.define(tag, type);
}

async function fetchTemplate(templateUrl) {
	if (!templateUrl || typeof templateUrl !== 'string') {
		throw new Error(`invalid HTML template URL: ${templateUrl}`);
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

function validataTag(tag) {
	if (!tag || typeof tag !== 'string' || !/^[a-z]+(-[a-z]+)*-[a-z]+$/.test(tag)) {
		throw new Error(`invalid element's tag/name: ${tag}`);
	}
	if (componentHTMLs[tag]) {
		throw new Error(`'${tag}' MAY NOT be initialized more than once`);
	}
}

function validateType(tag, type) {
	if (!type || !(type.prototype instanceof ComponentBase)) {
		throw new Error(`invalid class for '${tag}'; MUST NOT be null and MUST be an instance of ComponentBase`);
	}
	if ((!(TEMPLATE_PROPERTY in type) && !(HTML_URL_PROPERTY in type)) ||
		(TEMPLATE_PROPERTY in type && HTML_URL_PROPERTY in type)) {
		throw new Error(`'${tag}' MUST implement either static getter of '${HTML_URL_PROPERTY}' property returning component's HTML path, or static getter of '${TEMPLATE_PROPERTY}' property returning a template`);
	}
}