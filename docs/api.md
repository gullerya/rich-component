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
* `static get template()` - static getter returning a `template` element or a `function` to provide template dynamically during component's creation
	* `function` - when functional path taken, the function self will be resolved and cached during the component's definition phase, similarly to the static templates; regular function will be called while its scope (`this`) is the newly created element; first argument supplied will be the same newly created element too, that's for the `arrow function` syntax to be able to still get the context