[![GitHub](https://img.shields.io/github/license/gullerya/rich-component.svg)](https://github.com/gullerya/rich-component)
[![npm](https://img.shields.io/npm/v/rich-component.svg?label=npm%20rich-component)](https://www.npmjs.com/package/rich-component)
[![Travis](https://travis-ci.org/gullerya/rich-component.svg?branch=master)](https://travis-ci.org/gullerya/rich-component)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/rich-component/master.svg)](https://codecov.io/gh/gullerya/rich-component/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/4edd26352163476cbcc79d714cd1990b.svg?logo=codacy)](https://www.codacy.com/app/gullerya/rich-component)

# Summary

__`rich-component`__ provides a set of means to easily manage WebComponents with HTML template.

> Terms `component` and `custom element` are used interchangeably here.

Its call is to fill up some functional gap when there is a need to conveniently manage __HTML template__ for Web Component.

It helps order and cleanness freaks like myself to separate easily the HTML/CSS from the JavaScript.

> Myself took it as a best practice to separate those for better readability, Dev tools support (when HTML/CSS mixed into JS their support usually becomes very limited, if any) and future extensibility easiness. It is only when I'm absolutely sure, that the component will stay small and simple, I'm inlining the template, and even then I'm half hearted.

`rich-component` ensures that template for your custom element is provided correctly, fetches/caches the templates when needed and finally injects the templated `HTML` into the `shadowRoot` of each newly created component instance.

Few points to stress:
* `rich-component` is very __small__ in itself and has very __narrow__ defined functionality, it's more like a utility or a micro-framework, than a full blown beast
* __simplicity__ is one of the primary things the author concerned with
* APIs designed to second the __native component definition__ APis, so migration to & from `rich-component` requires minimalistic effort - it's not binding you to anything
* when template needs to be fetched over the network, the `custom element` definition postponed to that, thus making the component available to the application only when ready to use
* template's content is by default inserted to an __open__ `shadowRoot` of component instance

> Customized built-in elements are not yet supported, will extend the library upon first such a use-case.

#### Last versions (full changelog is [here](./docs/changelog.md))

* __0.0.1__
  * initial take

# Usage

The workflow is ultimately simple:
* import `rich-component`'s APIs
* define your `component`'s class extending library's `ComponentBase` class, which extends `HTMLElement`
* part of your class implementation should include a template for your `custom element` (see APIs for the details)

Example. Let's assume that we build a complex component, willing to externalize the HTML (with CSS) part out of JavaScript code.

Thus we have the markup in, say, `my-element.html` file. Its content may look like this (abbreviated):
```html
<style>
  :host { ... }
  
  .content { ... }
</style>

<div class="header"></div>
<div class="content"></div>
<div class="footer"></div>
```

Now we can define the `my-element` component in the `my-element.js`, assuming its location beside the `my-element.html` file above:
```javascript
import { initComponent, ComponentBase } from './dist/rich-component.min.js';
...

initComponent('my-element', class extends ComponentBase {

  ...

  static get htmlUrl() {
		return import.meta.url.replace(/js$/, 'html');
	}
});
```

Of course, URL of HTML may be given any other way, even hardcoded, but I've found myself typically using the above pattern, which makes my components look uniformly.

Having the code as above, `rich-component` will first ensure that you have a properly defined template source, failing as fast as possible. It will then fetch the template and cache it during initialization. It will inject the above HTML into the `shadowRoot` each time `my-element` is constructed.

# API

TBD