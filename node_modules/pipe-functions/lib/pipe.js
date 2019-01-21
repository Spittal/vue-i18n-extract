'use strict';

const pipe = (...fns) => fns.length === 1 ? fns[0].constructor === Function ? fns[0]() : fns[0] : fns.reduce((v, f, i) => {
	if (i === 1 && v && v.constructor === Function) {
		let exec = v();
		if (exec && exec.then) {
			return exec.then(v => f(v));
		} else {
			return f(exec);
		}
	} else if (v && v.then) {
		return v.then(v => f(v));
	} else {
		return f(v);
	}
});

module.exports = pipe;