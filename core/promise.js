define(function () {
	return function (promisor) {
		var callbacks = [],
			isDone = false,
			payload = undefined,
			pending = 0,
			promises = [],
			execute = function () {
				var _callbacks = callbacks;
				callbacks = [];
				_callbacks.forEach(function (callback) {
					callback.apply(this, payload);
				});
			},
			deferred = {
				done: function () {
					payload = arguments || payload;
					pending--;
					if (pending <= 0) {
						isDone = true;
						execute();
					}
					return this;
				}
			};
		if (promisor instanceof Function) {
			promisor(deferred);
		}
		return {
			when: function (promise) {
				if (promises.indexOf(promise) === -1) {
					promises.push(promise);
					pending++;
					promise.then(deferred.done);
				}
				return this;
			},
			then: function (success /* , failure, progress */ ) { // TODO
				if (callbacks.indexOf(success) === -1) {
					callbacks.push(success);
					if(isDone) {
						execute();
					}
				}
				return this;
			}
		};
	};
});
