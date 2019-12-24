# API

Below are details of the `rich-component`'s exported APIs, their description and usage.

### __`async void initComponent(tag, type)`__

Initializes custom element `tag` with class `type`. Prior to that, validates template presence (see below), fetches (if needed) and caches it.

* __`tag`__ - component's name (lower case, at least one dash)
* __`type`__ - component's class
	* MUST extend `ComponentBase` shipped within `rich-component`
	* MUST implement one and only one template provider, see below

If parameters are not up to requirements - error will be thrown (reject).

If the element with the `tag` already defined - error will be thrown (reject).

If template fetch by `htmlUrl` will fail (`response.ok` is `false` or body is empty) - error will be thrown (reject).

### __`class ComponentBase`__

The `type` parameter of the `initComponent` API should be a component's class, that extends `ComponentBase`.

`ComponentBase` self is not of much interest for the library's consumer, it mostly contains an internal management stuff.

From API perspective though, it serves much like a __marker interface__.

The important part is that consumer's extending class MUST contain one and only one of those:
* `static get htmlUrl()` - static getter returning a `string`, which will be treated as a path to the template resource
* `static get template()` - static getter returning a `template` element

### __`async string fetchTemplate(url)`__

This method was born for the internal usage and is nothing more than a syntax sugar over the native `fetch`.

Myself found it useful in one use-case, when some preprocessing of the `template` required, so decided to expose it as public API.

* __`url`__ - non-empty `string` treated as a path to the fetched resource

If the method succeeds to fetch a __non-empty__ content from the `url`, it resolves to that content as __`string`__, otherwise resolves to __`null`__.
Pay attention! This method does __not__ throw.