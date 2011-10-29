define(["core/promise"], function (promise) {
	module("promise", {
		setup: function () {
		},
		teardown: function () {
		}
	});

	test("Chaining", 2, function () {
		var myPromise = new promise;
		strictEqual(myPromise.when(new promise), myPromise, "When");
		strictEqual(myPromise.then(new Function), myPromise, "Then");
	});

	test("Then callback", 2, function () {
		(new promise(function(deferred) {
			deferred.done();
		}))
		.then(function() {
			ok(true, "Synchronous deferred fulfillment");
		})
		.then(function() {
			ok(true, "Multiple then callbacks");
		});
	});

	asyncTest("Asynchronous fulfillment", 1, function () {
		(new promise(function(deferred) {
			setTimeout(function () {
				deferred.done();
			}, 0);
		}))
		.then(function() {
			ok(true, "Asynchronous deferred fulfillment");
			start();
		});
	});

	test("When condition", 1, function () {
		var _deferred,
			condition = new promise(function(deferred) {
				_deferred = deferred;
			});
		(new promise())
		.when(condition)
		.then(function() {
			ok(true, "Promise fulfilled by when condition");
		});
		_deferred.done();
	});

	test("Multiple when conditions", 1, function () {
		var fulfilled = new promise(),
			conditions = [];
		[1, 2].forEach(function () {
			fulfilled.when(
				new promise(function (deferred) {
					conditions.push(deferred);
				})
			);
		}),
		fulfilled.then(function () {
			ok(true, "Promise fulfilled by when condition");
		});
		conditions.forEach(function (condition) {
			condition.done();
		});
	});

	return {};
});
