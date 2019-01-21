// Is not being mantained anymore
var pipe = function() {
	return Array.prototype.slice.call(arguments).reduce(function(v, f, i) {
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
};