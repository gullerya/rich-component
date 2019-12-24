[![GitHub](https://img.shields.io/github/license/gullerya/rich-component.svg)](https://github.com/gullerya/rich-component)
[![npm](https://img.shields.io/npm/v/rich-component.svg?label=npm%20rich-component)](https://www.npmjs.com/package/rich-component)
[![Travis](https://travis-ci.org/gullerya/rich-component.svg?branch=master)](https://travis-ci.org/gullerya/rich-component)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/rich-component/master.svg)](https://codecov.io/gh/gullerya/rich-component/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/4edd26352163476cbcc79d714cd1990b.svg?logo=codacy)](https://www.codacy.com/app/gullerya/rich-component)

# Summary

__`rich-component`__ provides a set of means to easily manage WebComponents with HTML template.

> Terms `component` and `custom element` are used interchangeably here.

Its call is to fill up some functional gap when there is a need to conveniently manage __HTML template__ for Web Component.

`rich-component` ensures that template for your custom element is provided correctly, fetches/caches the templates when needed and finally injects the templated `HTML` into the `shadowRoot` of each newly created component instance.

Few points to stress:
* `rich-component` is very __small__ in itself and very __narrow__ defined functionality, it's more like a utility or a micro-framework, than full blown beast
* __simplicity__ is one of the primary things the author concerned with
* APIs designed to second the __native componenet definition__ APis, so migration to & from `rich-component` requires minimalistic effort - it's not binding you to anything
* when template needs to be fetched over network, the `custom element` is defined only after that, thus enabling the component to the application only when ready to use

#### Last versions (full changelog is [here](./docs/changelog.md))

* __0.0.1__
  * initial take

# Usage

TBD

# API

TBD