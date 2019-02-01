# vue-i18n-extract

[![npm version](https://img.shields.io/npm/v/vue-i18n-extract.svg?style=flat-square)](https://www.npmjs.com/package/vue-i18n-extract)
[![npm downloads](https://img.shields.io/npm/dm/vue-i18n-extract.svg?style=flat-square)](https://www.npmjs.com/package/vue-i18n-extract)
[![CircleCI](https://circleci.com/gh/pixari/vue-i18n-extract/tree/master.png?style=shield)](https://circleci.com/gh/pixari/vue-i18n-extract)
[![Known Vulnerabilities](https://snyk.io/test/github/pixari/vue-i18n-extract/badge.svg?targetFile=package.json)](https://snyk.io/test/github/pixari/vue-i18n-extract?targetFile=package.json)
[![Maintainability](https://api.codeclimate.com/v1/badges/d21f341c33b2bfb6fe0e/maintainability)](https://codeclimate.com/github/pixari/vue-i18n-extract/maintainability)

## Installation
Use NPM:

```sh
$ npm install --save-dev vue-i18n-extract
```

or install with yarn:

```sh
$ yarn add --dev vue-i18n-extract
```

## The problem solved
This module analyses code statically for key usages in ($t(''), t(''), $t(``), t(``)) and all the language files (ex. de_DE.js, en_EN.js, ...), in order to:

- [x] Report keys that are missing in the language files
- [ ] Report unused keys in the language files
- [ ] Add automatically missing keys in the language files
- [ ] Remove automatically missing keys in the language files
- [ ] Report duplicated keys

I strongly suggest to use the `dot notation` in the placeholders. The language file is a JS object anyway and it is very helpful to organize the keys with a clear and readable structure.

This module works well in conjunction with:
* [VueI18n](https://kazupon.github.io/vue-i18n/)

## Supported keys

- [x] static (with $):
```js
$t('key.static')
```
- [x] static (without $): 
```js
t('key.static')
```
- [ ] string concatenation:
```js
$t('key.' + 'concat')
```
- [x] template string:
```js
$t((`key.template`)
```

## Why
I'm a big fan of [VueI18n](https://kazupon.github.io/vue-i18n/), the best and most used *internationalization plugin* for [Vue.js](https://vuejs.org/)

Setting up a Vue.js website with internationalization (i18n) support it easy nowadays: once you have installed the plugin and injected into the Vue instance, you can just put ‘{{ $t(‘Hello World’) }}‘ inside Vue component templates to use the plugin.

In my personal experience I just found difficult to keep the language files and the placeholders in the .vue files in sync.

That's why I wrote this small script to analyse and compare the language files and the .vue files, in order to 
Extract all $t('...') messages from a Vue.js (with vue-i18n) app and merge the new entries into the language files.


## :camera: Screenshot
That's how the result will look like:

<img src="https://raw.githubusercontent.com/pixari/vue-i18n-extract/master/demo/screenshots/vue-i18n-extract-1.png" width="600">

<img src="https://raw.githubusercontent.com/pixari/vue-i18n-extract/master/demo/screenshots/vue-i18n-extract-2.png" width="600">

## :rocket: How to run the script

Execute `main.js` passing two arguments: 

| Arguments | Description |
| ------ | ----------- |
| -s   | path to VueJs files |
| -l | path to language files (ex. de_DE.js, en_EN.js) |

For example, in order to execute the script using the `demo` folder, you will execute the following command:

```sh
$ node ./bin/vue-i18n-extract.js -s './demo/**/*.?(js|vue)' -l './demo/lang/*.js'
```

### Demo
In `package.json` you'll find a demo script.
Just run:

```sh
$ npm run demo
```

and it will execute the script taking all the files in ./demo.

### Test
In `package.json` you'll find a test script.
Just run:

```sh
$ npm run test
```

## :white_check_mark: To-Do
- [ ] Write test
- [ ] Report unused keys in the language files
- [ ] Add automatically missing keys in the language files
- [ ] Remove automatically missing keys in the language files
- [ ] Report duplicated keys
- [x] Add "static (without $)" support
- [ ] Add string concatenation support
- [x] Add template string support

## :exclamation: Issues

I'm sure you'll find bug I'll never see. It would be great if you'd like to [report them here](https://github.com/pixari/vue-i18n-extract/issues).


## :muscle: Contribution

The project is still in its early stages and in progess.
I think there's no need guidelines. Feel free to contribute or give feedback as you prefer.


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
