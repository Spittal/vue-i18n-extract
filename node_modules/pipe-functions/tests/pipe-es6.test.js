/*globals describe, it*/
'use strict';

const pipe = require('../lib/pipe-es6');
const assert = require('assert');

const capitalize = v => v[0].toUpperCase() + v.slice(1);
const quote = v => `"${v}"`;
const fetchAndSetBandName = v => new Promise((resolve, reject) => setTimeout(() => resolve(`Pink Floyd - ${v}`), 1000));
const fetchBandName = ({ song }) => new Promise((resolve, reject) => setTimeout(() => resolve({ song, band: 'Pink Floyd' }), 1000));
const concatBandAndSong = ({ song, band }) => `${band} - ${song}`;

describe('Pipe', function() {

	describe('Functions (sync)', function() {

		it(`'time' should be turned into '"Time"'`, function() {
			const result = pipe('time', capitalize, quote);
			assert.equal(result, `"Time"`);
		});

	});

	describe('Functions && Promises (sync && async)', function() {

		it(`'time' should be turned into 'Pink Floyd - Time'`, function(done) {

			pipe('time', capitalize, fetchAndSetBandName)
				.then(result => assert.equal(`Pink Floyd - Time`, result))
				.then(() => done());
		});

	});

	describe('Functions && Promises (sync && async) - Destructuring', function() {

		it(`'time' should be turned into 'Pink Floyd - Time'`, function(done) {

			pipe({ song: 'Time' }, fetchBandName, concatBandAndSong)
				.then(result => assert.equal(`Pink Floyd - Time`, result))
				.then(() => done());

		});

	});
});