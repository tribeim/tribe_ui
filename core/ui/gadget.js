define(["core/ui"], function (ui) {
	/*
		descriptor: {
			title: String|Element,
			content: String|Element
		}
	*/
	return function (descriptor) {
		var gadget = {},
			container = document.createElement("li"),
			headerElement = container.appendChild(document.createElement("h1")),
			contentElement = container.appendChild(document.createElement("section")),

			setValue = function (element, value) {
				if (typeof value === "string") {
					element.textContent = value;
				} else {
					while (element.hasChildNodes()) {
						element.removeChild(element.firstChild);
					}
					element.appendChild(value);
				}
			};

		var api = {
			get title () {return headerElement},
			set title (title) {
				setValue(headerElement, (gadget.title = title) || "");
			},

			get content () {return contentElement},
			set content (content) {
				setValue(contentElement, content || "");
			}
		};

		document.querySelector("#gadgets menu").appendChild(container);

		"title content".split(" ").forEach(function (key) {
			if (descriptor.hasOwnProperty(key)) {
				api[key] = descriptor[key];
			}
		});

		return api;
	};
});
