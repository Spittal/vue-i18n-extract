# string-search 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]
> Node module that carries out regex search on given multi-line string and returns match information.

## Features
[string-search](https://github.com/ospatil/string-search) finds and returns match information for each match.
- Accepts a multi-line string and regular expression in string format. 
- Searches the given string with provided regular expression.
- Returns a promise that eventually resolves to an array. The array contains match objects each having following attributes - 
  - line - line number(s) that the matched result was found on.
  - term - the search term.
  - text - the entire line(s) that the matched result was found in.

## Getting Started
Install with [NPM](https://www.npmjs.com) - `npm install --save string-search`

## Usage
```js
var stringSearcher = require('string-search');

stringSearcher.find('This is the string to search text in', 'string')
  .then(function(resultArr) {
    //resultArr => [ {line: 1, text: 'This is the string to search text in'} ]
  });
```

## API
### stringSearcher.find(targetString, regex)

Name         | Type           | Argument     | Description
-------------|----------------|--------------|------------
targetString | `string`       | `<required>` | target string to be searched. Can be multi-line(can contain line breaks).
regex        | `string`       | `<required>` | a string in regular expression format to search.

Returns **promise** that resolves to an array of objects containing following attributes -

Name | Type      | Description
-----|-----------| ------------
line | `integer` | line number that the matched result was found on.
term | `string`  | The search term
text | `string`  | the entire line(s) that the matched result was found in.

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Notes
Heavily inspired by [lineder](https://github.com/jasonbellamy/lineder). I needed file reading part separated from text searching part 
so that a file can be read only once and multiple searches can be carried out on it. I also used promise to return results instead of a callback.

## License
Copyright © 2015 [Omkar Patil](https://github.com/ospatil)

Licensed under the MIT license.

[npm-image]: https://badge.fury.io/js/string-search.svg?style=flat-square
[npm-url]: https://npmjs.org/string-search
[travis-image]: https://travis-ci.org/ospatil/string-search.svg?branch=master&style=flat-square
[travis-url]: https://travis-ci.org/ospatil/string-search
[daviddm-image]: https://david-dm.org/ospatil/string-search.svg?theme=shields.io&style=flat-square
[daviddm-url]: https://david-dm.org/ospatil/string-search
[coveralls-image]: https://img.shields.io/coveralls/ospatil/string-search.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/ospatil/string-search?branch=master
