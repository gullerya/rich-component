import { fetchTemplate } from './template-fetch.js';

const
	TEMPLATE_PROPERTY = 'template',
	HTML_URL_PROPERTY = 'htmlUrl',
	LIGHT_DOM_KEY = Symbol('attach.light.dom'),
	componentHTMLs = {};

class ComponentBase extends HTMLElement {
	constructor() {
		super();
		const template = this.getTemplate();
		const isLight = this.constructor.domType === 'light';
		if (template) {
			if (template.content) {
				injectTemplate(this, template, isLight);
			} else {
				template.then(t => {
					if (t) {
						injectTemplate(this, t, isLight);
						this.dispatchEvent(new Event('templated'));
					} else {
						console.error(`failed to get template for '${this.localName}'`);
					}
				});
			}
		} else {
			console.error(`failed to get template for '${this.localName}'`);
		}
	}

	connectedCallback() {
		if (LIGHT_DOM_KEY in this) {
			this.appendChild(this[LIGHT_DOM_KEY]);
			delete this[LIGHT_DOM_KEY];
		}
	}

	getTemplate() {
		let result = null;
		const cachedTemplate = componentHTMLs[this.localName];
		if (typeof cachedTemplate === 'function') {
			const dynamicTemplate = cachedTemplate.call(this, this);
			if (dynamicTemplate && dynamicTemplate.nodeName === 'TEMPLATE') {
				result = dynamicTemplate;
			} else if (typeof dynamicTemplate === 'string') {
				result = fetchTemplate(dynamicTemplate);
			}
		} else {
			result = cachedTemplate;
		}
		return result;
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

	//	fetch and cache template if URL based
	let template;
	if (TEMPLATE_PROPERTY in type) {
		template = type[TEMPLATE_PROPERTY];
		if ((!template || template.nodeName !== 'TEMPLATE') && typeof template !== 'function') {
			throw new Error(`'${tag}' provided invalid template: ${template}`);
		}
	} else {
		template = type[HTML_URL_PROPERTY];
		if ((!template || typeof template !== 'string') && typeof template !== 'function') {
			throw new Error(`'${tag}' provided invalid template URL: ${template}`);
		}
		if (typeof template === 'string') {
			template = await fetchTemplate(template);
		}
	}

	componentHTMLs[tag] = template;
	customElements.define(tag, type);
}

function validataTag(tag) {
	if (!tag || typeof tag !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*-[a-z0-9]+$/.test(tag)) {
		throw new Error(`invalid element's tag/name: ${tag}`);
	}
	if (customElements.get(tag)) {
		throw new Error(`'${tag}' element already defined`);
	}
}

function validateType(tag, Type) {
	if (!Type || !(Type.prototype instanceof ComponentBase)) {
		throw new Error(`invalid class for '${tag}'; MUST NOT be null and MUST be an instance of ComponentBase`);
	}
	if ((!(TEMPLATE_PROPERTY in Type) && !(HTML_URL_PROPERTY in Type)) ||
		(TEMPLATE_PROPERTY in Type && HTML_URL_PROPERTY in Type)) {
		throw new Error(`'${tag}' MUST implement either static getter of '${HTML_URL_PROPERTY}' property returning component's HTML path, or static getter of '${TEMPLATE_PROPERTY}' property returning a template`);
	}
}

function injectTemplate(target, template, light = false) {
	const c = template.content.cloneNode(true);
	if (light) {
		target[LIGHT_DOM_KEY] = c;
	} else {
		target.attachShadow({ mode: 'open' }).appendChild(c);
	}
}
