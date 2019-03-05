# vue-i18n-extract
[![npm version](https://img.shields.io/npm/v/vue-i18n-extract.svg?style=flat-square)](https://www.npmjs.com/package/vue-i18n-extract)
[![npm downloads](https://img.shields.io/npm/dm/vue-i18n-extract.svg?style=flat-square)](https://www.npmjs.com/package/vue-i18n-extract)
[![CircleCI](https://circleci.com/gh/pixari/vue-i18n-extract/tree/master.png?style=shield)](https://circleci.com/gh/pixari/vue-i18n-extract)
[![Known Vulnerabilities](https://snyk.io/test/github/pixari/vue-i18n-extract/badge.svg?targetFile=package.json)](https://snyk.io/test/github/pixari/vue-i18n-extract?targetFile=package.json)
[![Maintainability](https://api.codeclimate.com/v1/badges/d21f341c33b2bfb6fe0e/maintainability)](https://codeclimate.com/github/pixari/vue-i18n-extract/maintainability)
> Manage vue-i18n localization with static analysis

## :bookmark_tabs: Index:

* [Installation](#installation)
* [The problem solved](#smirk-the-problem-solved)
* [Documentation](#book-documentation)
* [Supported keys](#key-supported-keys)
* [Why?](#grey_question-why)
* [Screenshot](#camera-screenshot)
* [How to run the script](#rocket-how-to-run-the-script)
* [Demo](#demo)
* [Test](#gear-test)
* [To Do](#white_check_mark-to-do)
* [Issues](#exclamation-issues)
* [Contribution](#muscle-contribution)
* [License](#copyright-license)

## :cloud: Installation
Use NPM:

```sh
$ npm install --save-dev vue-i18n-extract
```

or install with yarn:

```sh
$ yarn add --dev vue-i18n-extract
```

## :smirk: The problem solved
This module analyses code statically for key usages in (ex. $t(''), $tc(''), ...) and all the language files (ex. de_DE.js, en_EN.json, ...), in order to:

- [x] Report keys that are missing in the language files
- [x] Report unused keys in the language files

I strongly suggest to use the `dot notation` in the placeholders. The language file is a JS object anyway and it is very helpful to organize the keys with a clear and readable structure.

This module works well in conjunction with:
* [VueI18n](https://kazupon.github.io/vue-i18n/)

## :book: Documentation
Currently 4 API are exposed:

* analyzeVueFiles
* analyzeLanguageFiles
* analyzeI18n
* analyzeUnusedKeys
* logReport
* logReportUnusedKeys

### analyzeVueFiles

| Arguments | Description |
| ------ | ----------- |
| vueFilesPath  |  path to VueJs file/s. Accepts a glob pattern. (ex. './foo/**/*.(bar\|moo)') |

An object based on same structure of a "language file" containing all the strings found in the given path. Strings provided in "object dot notation" will be parsed as objects. Ex: "foo.bar.test" will be { foo: { bar: { test }}}

### analyzeLanguageFiles

| Arguments | Description |
| ------ | ----------- |
| langFilesPath  |  path to language file/s. Accepts a glob pattern. (ex. './foo/lang/*.(bar\|moo)') |

An array of objects. Every language files generates an element with 3 properties:
* filename: filename of the language file
* path: path of the language file
* content: the object described in the language file. It does actually a "require".

### analyzeI18n
(langFileContent, vueFilesAnalysis)

| Arguments | Description |
| ------ | ----------- |
| langFileContent  | The output of analyzeVueFiles |
| vueFilesAnalysis  | One of output's element of analyzeLanguageFiles |

Compares the vueI18nStrings (all the i18n strings have been found in the vueFilesPath) and langFileContent, the language object (analyzeLanguageFiles generates an array of them, one for each language file).

Returns an object with 4 properties:
* filename: name of the language file
* currentEntries: current state of the language file
* missingEntries: array of missing i18n entries,
* fixedEntries: how the language object should be (the current entries + the missing ones)

### analyzeUnusedKeys
(langFileContent, vueFilesAnalysis)

| Arguments | Description |
| ------ | ----------- |
| langFileContent  | The output of analyzeVueFiles |
| vueFilesAnalysis  | One of output's element of analyzeLanguageFiles |

Compares the language entries (langFileContent) with the vueI18nStrings (all the i18n strings have been found in the vueFilesPath).

Returns an object with 4 properties:
* filename: name of the language file
* currentEntries: current state of the language file
* missingEntries: array of unused i18n entries,
* fixedEntries: how the language object should be (the current entries + the missing ones)

### logReport
| Arguments | Description |
| ------ | ----------- |
| i18nAnalysis  | One of the outputs elements of analyzeI18n |

"Console.log" the missing entries.

### logReportUnusedKeys
| Arguments | Description |
| ------ | ----------- |
| i18nAnalysis  | One of the outputs elements of analyzeI18n |

"Console.log" the unused entries.

## :key: Supported keys

- [x] static (with $):
```js
$t('key.static') and $tc('key.static')
```
- [x] static (without $):
```js
t('key.static') and tc('key.static')
```
- [x] template string:
```js
$t((`key.template`) and $tc((`key.template`)
```
- [x] template i18n component:
```js
<i18n path="key.template.component">
</i18n>
```
- [x] v-t directive with string literal (no path support to the component data):
```js
<p v-t="'key.directive.string'"></p>
```


## :grey_question: Why
I'm a big fan of [VueI18n](https://kazupon.github.io/vue-i18n/), the best and most used *internationalization plugin* for [Vue.js](https://vuejs.org/)

Setting up a Vue.js website with internationalization (i18n) support it easy nowadays: once you have installed the plugin and injected into the Vue instance, you can just put ‘{{ $t(‘Hello World’) }}‘ inside Vue component templates to use the plugin.

In my personal experience I just found difficult to keep the language files and the placeholders in the .vue files in sync.

That's why I wrote this small script to analyse and compare the language files and the .vue files, in order to
Extract all $t('...') messages from a Vue.js (with vue-i18n) app and merge the new entries into the language files.


## :camera: Screenshot
That's how the result will look like:

<img src="https://raw.githubusercontent.com/pixari/vue-i18n-extract/master/demo/screenshots/vue-i18n-extract-3.png" width="600">

<img src="https://raw.githubusercontent.com/pixari/vue-i18n-extract/master/demo/screenshots/vue-i18n-extract-4.png" width="600">

## :rocket: How to run the script

Execute `main.js` passing two arguments:

| Arguments | Description |
| ------ | ----------- |
| -s   | path to VueJs file/s, accepts a glob pattern  |
| -l | path to language file/s, accepts a glob pattern (ex. de_DE.js, en_EN.json) |
| -k | use if you do not use dot notation for your keys but instead use the key as the translation value for fallback purposes. Default: False |

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

### :gear: Test
In `package.json` you'll find a test script.
Just run:

```sh
$ npm run test
```

## :white_check_mark: To-Do
- [ ] Write test
- [x] Report unused keys in the language files
- [x] Add "static (without $)" support
- [x] Add template string support

## :exclamation: Issues

I'm sure you'll find bug I'll never see. It would be great if you'd like to [report them here](https://github.com/pixari/vue-i18n-extract/issues).


## :muscle: Contribution

The project is still in its early stages and in progess.
I think there's no need guidelines. Feel free to contribute or give feedback as you prefer.


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
