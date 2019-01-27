# vue-i18n-extract
Extract all $t('...') messages from a Vue.js (with vue-i18n) app and merge the new entries into the language files.

## :camera: Screenshot
That's how the result will look like:

<img src="https://raw.githubusercontent.com/pixari/vue-i18n-extract/master/demo/screenshots/vue-i18n-extract-1.png" width="600">

## :book: Usage

First, install `vue-i18n-extract`:

```sh
$ npm install --save-dev vue-i18n-extract
```

or install with yarn:

```sh
$ yarn add --dev vue-i18n-extract
```

Then you can run the script.


### How to run the script

Execute `main.js` passing two arguments: 

| Arguments | Description |
| ------ | ----------- |
| -s   | path to VueJs files |
| -l | path to language files (ex. de_DE.js, en_EN.js) |

For example, in order to execute the script using the `demo` folder, you will execute the following command:

```sh
$ node main.js -s ./demo/vue_files -l ./demo/lang
```

### Demo
In `package.json` you'll find a demo script.
Just run:

```sh
$ npm run demo
```

and it will execute the script taking all the files in ./demo.


## Debug in VS CODE
Just add this configuration to your `launch.json` file:

```js
{
  "type": "node",
  "request": "launch",
  "name": "vue-i18n-extract",
  "program": "${workspaceFolder}/main.js",
  "args": [
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
