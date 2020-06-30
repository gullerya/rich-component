# Changelog

* __1.5.0__
  * updated dependencies versions
  * adjusted the repo and the dist to the better practice (dist is not committed but published only)

* __1.3.0__
  * implemented [issue #4](https://github.com/gullerya/rich-component/issues/4) - added `domType` component's property support to allow adding the template's DOM as `light` rather then `shadow`

* __1.2.0__
  * implemented [issue #2](https://github.com/gullerya/rich-component/issues/2) - `getTemplate` is part of the `ComponentBase`, still not documented; `fetchTemplate` is hereby deprecated and any usage of it should be removed, I'll remove is from API next version or two
  * implemented [issue #3](https://github.com/gullerya/rich-component/issues/3) - `template` getter may now provide a function to resolve the template dynamically
  * added docs and tests

* __1.1.0__
  * fixing [issue #1](https://github.com/gullerya/rich-component/issues/1) - allowing number in the custom element's tag/name
  * added docs and tests

* __1.0.0__
  * first release
  * added docs and tests

* __0.1.0__ initial one