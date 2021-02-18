# API v1 (current version)

`rich-component` v1 API are roughtly comprised of 2:
- the class definition, that should be extended by the consuming component
- the initializer method

## __`async void initComponent(tag, type)`__

Initializes custom element `tag` with class `type`, validates template provisioning, fetches (if needed) and caches it (see below).

- __`tag`__ - component's name (lower case, at least one dash)
- __`type`__ - component's class
	- MUST extend `ComponentBase` shipped within `rich-component`
	- MUST implement one and only one template provisioning strategy (see below)

This method will throw (reject) in the following cases:
- parameters are not as required
- the `tag` is already defined
- the template fetch (`htmlUrl` strategy) fails (`response.ok` is `false` or body is empty)

## __`class ComponentBase`__

The `type` parameter of the `initComponent` API should be a component's class, that extends `ComponentBase`.

`ComponentBase` self is not of much interest for the library's consumer, it mostly contains an internal management stuff.

From API perspective though, it serves much like a __marker interface__.

The important part is that consumer's extending class MUST implement one and only one of the following strategies.
> Pay attention, that each of the strategies allows one of 2 flavors: immediate / lazy (or static / dynamic).

### Template element

Implemention - `static get template()` getter. This strategy allows you to provide an actual `<template>` element (instance) of your own craft.

The getter MUST return either of those:
- `<template>` - static flavor; MUST be a valid `template` element
- `function self => <template>` - dynamic flavor; this function will be called **each time** the component is created, during construction; it is expected to return a valid `template` element; the function will be provided with the component instance as first parameter (`self`)

### Template URL

Implementation - `static get htmlUrl()` getter. This strategy allows to provide URL (as `string`), which will be used to fetch and initiate the `template`.

The getter MUST return either of thoss:
- `string` - static flavor; MUST be a non-empty URL to the template resource
- `function self => string` - dynamic flavor; this function will be called **each time** the component is created, during construction; it is expected to return a valid `string` URL; the function will be provided with the component instance as first parameter (`self`)
	- this is the only flavor where injection of template will happen in **after** the c~tor is done; you **may not** assume that the template injected, but only in `templated` event
	- to allow post template injection logic, this flavor will fire `templated` event on the component

### Shadow vs Light (optional)

By default `rich-component` will inject the template into the shadow DOM.

One may opt to use light DOM instead, using the following getter:
- `static get domType()` - returning a `string` with the following values supported
	- `shadow` - default; template's contents are added to the __open shadow DOM__; addition happens in `constructor`
	- `light` - template's contents are added as a __light DOM__; addition happens in `connectedCallback`, therefore if the components implements that callback, it MUST perform `super.connectedCallback()`