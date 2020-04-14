# How To Use
## Getting Started

Install `vue-i18n-extract` using [Yarn](https://yarnpkg.com)
```sh
yarn add -D vue-i18n-extract
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
npm run vue-i18n-extract report -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json|yml|yaml)'
```
or

```sh
yarn vue-i18n-extract report -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json|yml|yaml)'
```

This will print out a table of missing keys in your language files, as well as unused keys in your language files.

## Running From Command Line

You can run `vue-i18n-extract` directly from the CLI without having to install anything using npx

```sh
npx vue-i18n-extract report -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json|yml|yaml)'
```

or

```sh
yarn dlx vue-i18n-extract report -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json|yml|yaml)'
```

### CLI Options

#### `-v, --vueFiles` Required
The Vue.js file(s) you want to extract i18n strings from. It can be a path to a folder or to a file. It accepts glob patterns.
`./path/to/your/vue-files/**/*.?(js|vue)`

#### `-l, --languageFiles` Required
The language file(s) you want to compare your Vue.js file(s) to. It can be a path to a folder or to a file. It accepts glob patterns.
`./path/to/your/language-files/*.?(js|json|yml|yaml)`

#### `-o, --output`
Use if you want to create a json file out of your report.
`-o output.json`

#### `-a, --add`
Use if you want to add missing keys into your language files.
`-a`

## Usage in NodeJS
Make sure you have `vue-i18n-extract` installed locally and then just import the library and uses the API:

```js
const VueI18NExtract = require('vue-i18n-extract');

const report = VueI18NExtract.createI18NReport('./path/to/vue-files/**/*.?(js|vue)', './path/to/language-files/*.?(js|json|yml|yaml)');
```
