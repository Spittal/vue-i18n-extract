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

You can run `vue-i18n-extract` directly from the CLI without having to install anything using npx

```sh
npx vue-i18n-extract report -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json)'
```

or

```sh
yarn dlx vue-i18n-extract report -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json)'
```

## Usage in NodeJS
Make sure you have `vue-i18n-extract` installed locally and then just import the library and uses the API:

```js
const VueI18NExtract = require('vue-i18n-extract');

const report = VueI18NExtract.createI18NReport('./path/to/vue-files/**/*.?(js|vue)', './path/to/language-files/*.?(js|json)');
```

## Add every missing keys to languages files
**What is it ?**<br/>
It is an option to the `report` command, that write every missing keys found by the script, into every locale json files.<br/>
It supports nested keys.

**Why/When should i use it ?**<br/>
You should use it when you want a smoother workflow using `vue-i18n` and `vue-i18n-extract`.<br/>
You should use it if you are working with lots of i18n locale json files.<br/>
A developer that uses this plugin want to know unused and missing keys in his program, but then he might have to write every missing keys by himself in every locale files, which is both error prone and time consumming.
This option is here to remedy this situation.<br/>
In a typical development workflow this allow a developer to write new vue code, and add new i18n traduction keys within this new code :
``$t(new.nested.keys.for.example)``<br/>
He will then be able to run the command with this option, and every new key he added into his vue files, would be set nested at the correct place in every json languages files.
Now the developer only has to hand over the json locale files to a traduction team, or modify new empty keys by himself.

**How do i use it ?**<br/>
Simply add `-a true` at the end of the previously used commands using `report`.<br/>
For example if you installed vue-i18n-extract globally you can then run directly from the command line:

```sh
vue-i18n-extract report -v './path/to/your/vue-files/**/*.?(js|vue)' -l './path/to/your/language-files/*.?(js|json)' -a true
```

This command would still display missing and unused key, but it will also put every missing keys into every locale json files selected by the following glob pattern:

```sh
-l './path/to/your/language-files/*.?(js|json)'
```
