export {
	fetchTemplate
}

const templatesCache = {};

async function fetchTemplate(templateUrl, forceRefetch = false) {
	if (!templateUrl || typeof templateUrl !== 'string') {
		throw new Error(`invalid template URL: ${templateUrl}`);
	}

	let resultPromise = templatesCache[templateUrl] || null;
	if (!resultPromise || forceRefetch) {
		resultPromise = new Promise((resolve, reject) => {
			fetch(templateUrl)
				.then(r => {
					if (!r.ok) {
						throw new Error(`failed to fetch template from '${templateUrl}', status ${r.status}`);
					} else {
						return r.text();
					}
				})
				.then(t => {
					if (!t) {
						throw new Error(`failed to fetch template from '${templateUrl}', no content`);
					} else {
						const r = document.createElement('template');
						r.innerHTML = t;
						resolve(r);
					}
				})
				.catch(reject);
		});
		templatesCache[templateUrl] = resultPromise;
	}

	return resultPromise;
}