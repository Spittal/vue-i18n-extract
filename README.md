<h1 align="center">vue-i18n-extract</h1>
<p align="center">
  <img align="center" src="https://raw.githubusercontent.com/pixari/vue-i18n-extract/master/demo/screenshots/vue-i18n-extract-3.png">
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/vue-i18n-extract"><img src="https://img.shields.io/npm/v/vue-i18n-extract.svg?style=flat-square" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/vue-i18n-extract"><img src="https://img.shields.io/npm/dm/vue-i18n-extract.svg?style=flat-square" alt="Downloads"></a>
  <a href="https://circleci.com/gh/pixari/vue-i18n-extract"><img src="https://circleci.com/gh/pixari/vue-i18n-extract/tree/master.png?style=shield" alt="CircleCI Status"></a>
  <a href="https://snyk.io/test/github/pixari/vue-i18n-extract?targetFile=package.json"><img src="https://snyk.io/test/github/pixari/vue-i18n-extract/badge.svg?targetFile=package.json" alt="Known Vulnerabilities"></a>
  <a href="https://codeclimate.com/github/pixari/vue-i18n-extract/maintainability"><img src="https://api.codeclimate.com/v1/badges/d21f341c33b2bfb6fe0e/maintainability" alt="Maintainability"></a>
</p>

---

`vue-i18n-extract` is built to work with your Vue.js projects using [vue-i18n](https://kazupon.github.io/vue-i18n/). When run `vue-18n-extract` analyses your Vue.js source code for any `vue-i18n` key usages (ex. $t(''), $tc(''), ...) as well as your language files (ex. de_DE.js, en_EN.json, ...), in order to:

- [x] Report keys that are missing in the language files.
- [x] Report unused keys in the language files.

## :rocket: Getting Started

Install `vue-i18n-extract` using [Yarn](https://yarnpkg.com)
```sh
yarn add --dev vue-i18n-extract
```
Or [NPM](https://www.npmjs.com/)
```sh
npm install --save-dev vue-i18n-extract
```

> Note: `vue-i18n-extract` documentation uses `yarn` commands, but `npm` will also work. You can compare `yarn` and `npm` commands in the `yarn` docs, [here](https://yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison).

Add the following section to your `package.json`:
```json
{
  "scripts": {
    "vue-i18n-extract": "vue-i18n-extract"
  }
}
```

Finally, run:
```sh
yarn vue-i18n-extract diff -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json)'
```

This will print out a table of missing keys in your language files, as well as unused keys in your language files.

## :key: Supported keys

- [x] Static in template or script:
```js
$t('key.static') $t("key.static") $t(`key.static`) // Single or double quote, and template literals
t('key.static') t("key.static") t(`key.static`) // Without dollar sign

$tc('key.static.plural') $tc('key.static.plural') $tc(`key.static`) // $tc Support for use with plurals
tc('key.static.plural') tc('key.static.plural') tc(`key.static`) // Without dollar sign
```
- [x] i18n component:
```html
<i18n path="key.template.component"></i18n>
```
- [x] v-t directive with string literal:
```html
<p v-t="'key.directive.string'"></p>
```
> Note: As of right now there is no object support to reference that path from component data

## Demo & Tests
Clone this git repository:
```sh
git clone git@github.com:pixari/vue-i18n-extract.git
```

Install dependencies:
```sh
yarn
```

Then run the demo:
```sh
yarn demo
```

This will use the data in the demo folder to generate a report.

To run tests:
```sh
yarn test
```

## :grey_question: Why?
I'm a big fan of [vue-i18n](https://kazupon.github.io/vue-i18n/). It's the best and most used *internationalization plugin* for [Vue.js](https://vuejs.org/)

Setting up a Vue.js website with internationalization (i18n) support it easy nowadays: Once you have installed the plugin and injected into the Vue instance, you can just put ‘{{ $t(‘Hello World’) }}‘ inside Vue.js component templates to use the plugin. However, in my personal experience I found it very difficult to keep the language files and the placeholders in the .vue files in sync.

That's why I wrote vue-i18n-extract; I needed a way to analyze and compare my language files to my Vue.js source files, then report the result in a useful way.

## :white_check_mark: To-Do
- [ ] Write test
- [x] Report unused keys in the language files
- [x] Add "static (without $)" support
- [x] Add template string support

## :exclamation: Issues

I'm sure you'll find bugs and when you do it would be great if you'd could [report them here](https://github.com/pixari/vue-i18n-extract/issues).

## :muscle: Contribution

The project is still in its early stages and in progress. I think there's no need for guidelines yet, so feel free to contribute or give feedback as you prefer.

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
