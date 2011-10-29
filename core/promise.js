define(function () {
	return function (promisor) {
		var callbacks = [],
			isDone = false,
			payload = undefined,
			pending = 0,
			promises = [],
			unique = parseInt(Math.random() * 1000000),
			deferred = {
				done: function () {
					console.log("promise", unique, "done", pending);
					isDone = true;
					payload = arguments;
					pending--;
					if (pending <= 0) {
						console.log("promise", unique, "FEUER FREI!", pending);
						callbacks.forEach(function (callback) {
							callback.apply(this, payload);
						});
					}
					return this;
				}
			};
		if (promisor instanceof Function) {
			//setTimeout(function () { promisor(deferred); }, 0);
			promisor(deferred);
		}
		return {
			when: function (promise) {
				//console.log("promise", unique, "when", pending);
				if (promises.indexOf(promise) === -1) {
					promises.push(promise);
					pending++;
					promise.then(deferred.done);
				}
				return this;
			},
			then: function (success /* , failure, progress */ ) { // TODO
				//console.log("promise", unique, "then", pending);
				if (callbacks.indexOf(success) === -1) {
					callbacks.push(success);
					if(isDone) {
						console.log("promise", unique, "FEUER FREI! (THEN!!)", pending);
						callbacks.forEach(function (callback) {
							callback.apply(this, payload);
						});
					}
				}
				return this;
			}
		};
	};
});
