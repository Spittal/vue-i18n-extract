
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

<p align="center">
  <a href="https://www.patreon.com/bePatron?u=17437545" target="_blank">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patreon">
  </a>                                                                                   
</p>
         
> I love contribution to the open-source community and basically I'd like to focus on the Vue.js ecosystem and tools.
> My first patreon goal is to have the *freedom to work* on some projects and to *reward the main contributors* of my libraries.
> I get continuous support from *very kind and smart people*, and I'd like to have also a *budget for them*.
                                                                                     
---

# Introduction

Setting up a Vue.js website with internationalization (i18n) support it easy nowadays: Once you have installed the plugin and injected into the Vue instance, you can just put $t(‘Hello World’) inside Vue.js component templates to use the plugin.
However, in our personal experience we found it very difficult to keep the language files and the placeholders in the .vue files in sync.

That's why we wrote vue-i18n-extract; We needed a way to analyze and compare our language files to our Vue.js source files, then report the result in a useful way.

## What is it?
`vue-i18n-extract` is built to work with your Vue.js projects using the library [vue-i18n](https://kazupon.github.io/vue-i18n/).

This library analyses your Vue.js source code looking for any `vue-i18n` key usage, in order to:

- extract and report all the **missing keys** in the language files;
- extract and report all the **unused keys** in the language files;
- optionnaly write every **missing keys** into every language files;

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)

## :exclamation: Issues

I'm sure you'll find bugs and when you do it would be great if you'd could [report them here](https://github.com/pixari/vue-i18n-extract/issues).
