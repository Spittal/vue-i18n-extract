# Features

- Support for every standard `vue-i18n` key.
- JSON, YAML, and JS language file support.
- Logs missing and unused keys.
- Can write report to a JSON file.
- Can add missing keys to language files, if that's part of your workflow.

## Supported Keys

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

