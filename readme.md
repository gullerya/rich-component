[![GitHub](https://img.shields.io/github/license/gullerya/rich-component.svg)](https://github.com/gullerya/rich-component)
[![npm](https://img.shields.io/npm/v/rich-component.svg?label=npm%20rich-component)](https://www.npmjs.com/package/rich-component)
[![Travis](https://travis-ci.org/gullerya/rich-component.svg?branch=master)](https://travis-ci.org/gullerya/rich-component)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/rich-component/master.svg)](https://codecov.io/gh/gullerya/rich-component/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/4edd26352163476cbcc79d714cd1990b.svg?logo=codacy)](https://www.codacy.com/app/gullerya/rich-component)

# Summary

__`rich-component`__ provides a set of means to easily manage WebComponents with HTML template.

> Terms `web component` and `custom element` are used interchangeably here.

It helps order and cleanness freaks like myself to separate easily the HTML/CSS from the JavaScript.

`rich-component` ensures correctness of the provided template, fetches/caches the template when needed and injects it into the `shadow`/`light` of each newly created component instance.

Few points to stress:
- `rich-component` is very __small__ in itself and has very __narrow__ defined functionality, it's more like a utility or a micro-framework, than a full blown beast
- __simplicity__ is one of the primary things the author concerned with
- APIs designed to second the __native component definition__ APis, so migration to & from `rich-component` requires minimal effort - it's not binding you to anything
- when template needs to be fetched over the network, the `custom element` definition postponed to that, thus making the component available to the application only when ready to use (dynamic URL case being an exception)
- template's content defaultly added to an __open shadow DOM__; one may opt adding it to a __light DOM__.

> Customized built-in elements are not yet supported, will extend the library if/when that spec will become widely supported by browsers.

## Last versions (full changelog is [here](docs/changelog.md))

- __1.7.0__
  - implemented [issue #8](https://github.com/gullerya/rich-component/issues/8) - added test and documentation of already available functionality
  - updated dependencies versions

- __1.6.0__
  - updated dependencies versions
  - adjusted the repo and the dist to the better practice (dist is not committed but published only)

- __1.3.0__
  - implemented [issue #4](https://github.com/gullerya/rich-component/issues/4) - added `domType` component's property support to allow adding the template's DOM as `light` rather then `shadow`

# Usage

The workflow is ultimately simple:
- import `rich-component`'s [API](docs/api.md)
- define your `component`'s class extending library's `ComponentBase` class, which extends `HTMLElement`
- part of your class implementation should provide a template for your `custom element` (see [API](docs/api.md) documentation for the details)

## Basic example

Lets assume, that the template is found in `my-element.html` file.

We can now define the `my-element` component in the `my-element.js` (assuming it located beside `my-element.html`):
```js
import { initComponent, ComponentBase } from './dist/rich-component.min.js';
...

initComponent('my-element', class extends ComponentBase {

  ...

  static get htmlUrl() {
		return import.meta.url.replace(/js$/, 'html');
	}
});
```

Of course, URL of HTML may be given any other way, even hardcoded, but I've found myself typically using the above pattern, making components look uniformly.

Having the code as above, `rich-component` will do the following steps:
- first ensure a properly defined template source, failing fast if otherwise
- then fetch the template and cache it
- define the custom element in registry
- inject the template into the `shadowRoot` each time `my-element` is constructed

## Dynamic resolution example

For the best readability and predictability of the flow, it is most advised to staticly provide the template URL (or template content) upfront.

Sometimes it is required to switch the template dynamically, based on instance attributes, for example.

For those use cases `template` / `htmlUrl` **may** return a function.

That function will be called during element's construction and expected to return a template or template URL (correspondingly to getter).

Consider the following example of dynamic template:
```js
initComponent('my-element', class extends ComponentBase {

  static get template() {
		return self => {
			return self.hasAttribute('readonly') ? x : y;
		};
	}
});
```

In the example above, getter `template` provides a **function**, which will be called each instance construction returning relevant template (in our example `x`/`y`) based on instance attribute.

> Using the `rich-component` with 'inline' templates may still be convenient and provide some kind of a future proofness, making it an easy task to externalize HTML/CSS part when overgrown. Yet, IMHO it would also be perfectly right to not use `rich-component` at all in such a cases, but fall-back to the native API.

Detailed API is [here](docs/api.md).