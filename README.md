# vue-i18n-extract
Extract all $t('...') messages from a Vue.js (with vue-i18n) app and merge the new entries into the language files.


## :book: Documentation

First, install "vue-i18n-extract":

```sh
$ npm install --save-dev vue-i18n-extract
```

or install with yarn:

```sh
$ yarn add --dev vue-i18n-extract
```

## Debug in VS CODE
Just add this configuration to your `launch.json` file:

```js
{
  "type": "node",
  "request": "launch",
  "name": "vue-i18n-extract",
  "program": "${workspaceFolder}/main.js",
  "args": [
    "--experimental-modules",
    "-s ./demo/vue_files",
    "-l ./demo/lang",
  ]
}
```  

## :exclamation: Issues

I'm sure you'll find bug I'll never see. It would be great if you'd like to [report them here](https://github.com/pixari/vue-i18n-extract/issues).


## :muscle: Contribution

The project is still in its early stages and in progess.
I think there's no need guidelines. Feel free to contribute or give feedback as you prefer.


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)


## Links

* []()
