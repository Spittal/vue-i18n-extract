# pipe-functions

[![Build Status](https://api.travis-ci.org/DiegoZoracKy/pipe-functions.svg)](https://travis-ci.org/DiegoZoracKy/pipe-functions)

Pipe functions in a Unix-like style. It supports `Promises` (async) anywhere in the pipeline and every step will be executed sequentially. The *return* (*resolve* in case of `Promises`) of each function will be passed in as an argument to the next one

Key features:
- Supports `Promises`, or any lib following the Promises/A+ spec about being *thenable* (**.then()** method)
- `Promises` will be executed sequentially
- First argument can be of any type (`String`, `Number`, `Date`, etc.) or even a `Function` or a `Promise`
- Node.js and Browser ready (to be used on a Browser, without a build step, check `lib/pipe-non-es6.js`)
- Lightweight, **501 bytes**, before gzip!

## Install

### NPM / Node

```javascript
npm install pipe-functions
```

## Usage

### Sync

```javascript
const pipe = require('pipe-functions');

// First argument can be of any type
const result = pipe('input', fn1, fn2, fnN);
// And also a function
const result2 = pipe(fn0, fn1, fn2, fnN);
```

### Async (`Promises`)

If the pipeline contains a `Promise` anywhere in the pipeline, we must treat `pipe` like a `Promise` itself, so we must to use **.then()** to get the final result.

```javascript
const pipe = require('pipe-functions');

// First argument can be of any type, as shown in the previous example
pipe('input', fn1, fnPromise1, fn2, fnPromise2).then(console.log);
```

A suggestion regarding `Promises`. Probably you've seen, or had to write, a stack of promises like that:

```javascript
someAsyncFunction('param')
  .then(doSomethingWithTheResult)
  .then(doSomethingElseWithTheResultOfTheLast)
  .then(oneMore)
  .then(almostThere)
  .then(done)
  .catch(console.log)
```

It could be written as:

```javascript
const pipe = require('pipe-functions');

pipe(
    someAsyncFunction('param'),
    doSomethingWithTheResult,
    doSomethingElseWithTheResultOfTheLast,
    oneMore,
    almostThere,
    done
).catch(console.log)
```


## Examples

OBS: Some examples needs a platform with support for *Destructuring* (Nodejs v6+, Chrome).

### Sync

```javascript
const pipe = require('pipe-functions');

/** Functions **/
const capitalize = v => v[0].toUpperCase() + v.slice(1);
const quote = v => `"${v}"`;

/** Pipe **/
// result will be: "Time"
const result = pipe('time', capitalize, quote);
```

### Async (`Promises`)

```javascript
const pipe = require('pipe-functions');

/** Functions **/
// Sync
const capitalize = v => v[0].toUpperCase() + v.slice(1);
// Async
const fetchAndSetBandName = v => new Promise((resolve, reject) => setTimeout(() => resolve(`Pink Floyd - ${v}`), 1000));

/** Pipe **/
// the result will be: Pink Floyd - Time
pipe('time', capitalize, fetchAndSetBandName).then(console.log)
```
#### Example with destructuring,

To easily pass in more than one value (within an Object or Array) through the pipeline.

```javascript
const pipe = require('pipe-functions');

/** Functions **/
// Async
const fetchBandName = ({ song }) => new Promise((resolve, reject) =>
setTimeout(() => resolve({ song, band: 'Pink Floyd' }), 1000));
// Sync
const concatBandAndSong = ({ song, band }) => `${band} - ${song}`;

/** Pipe **/
// the result will be: Pink Floyd - Time
pipe('time', fetchBandName, concatBandAndSong).then(console.log)
```