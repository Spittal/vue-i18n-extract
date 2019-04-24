# Features

Make sure you have `vue-i18n-extract` installed locally and then just import
```js
const VueI18NExtract = require('vue-i18n-extract').default;

const report = VueI18NExtract.createI18NReport('./path/to/vue-files/**/*.?(js|vue)', './path/to/language-files/*.?(js|json)');
```

> Note: `vue-i18n-extract` has Typescript typings built in! :tada:

## Supported keys

- Static in template or script:
```js
// Single or double quote, and template literals
$t('key.static') $t("key.static") $t(`key.static`)

// Without dollar sign
t('key.static') t("key.static") t(`key.static`)

// $tc Support for use with plurals
$tc('key.static', 0) $tc("key.static", 1) $tc(`key.static`, 2)

// Without dollar sign
tc('key.static', 0) tc("key.static", 1) tc(`key.static`, 2)
```

- i18n component:
```html
<i18n path="key.component"></i18n>
```
> Note: As of right now there is no support for binding in path like `:path="condition ? 'string1' : 'string2'"` there is just support strings as shown above.

- v-t directive with string literal:
```html
<p v-t="'key.directive'"></p>
```
> Note: As of right now there is no object support to reference that path from component data

