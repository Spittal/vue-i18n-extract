# How to use it
## Getting started

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
npm run vue-i18n-extract report -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json)'
```
or

```sh
yarn vue-i18n-extract report -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json)'
```

This will print out a table of missing keys in your language files, as well as unused keys in your language files.

## Running from command line

You can run `vue-i18n-extract` directly from the CLI if you have install it globally

```sh
npm install --global vue-i18n-extract
```

or

```sh
yarn global add vue-i18n-extract
```

From anywhere you can now run:
```sh
vue-i18n-extract report -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json)'
```

## Usage in NodeJS
Make sure you have `vue-i18n-extract` installed locally and then just import the library and uses the API:

```js
const VueI18NExtract = require('vue-i18n-extract').default;

const report = VueI18NExtract.createI18NReport('./path/to/vue-files/**/*.?(js|vue)', './path/to/language-files/*.?(js|json)');
```