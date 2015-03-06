(function (window, document, undefined) {
	'use strict';

	var e = Object.create(HTMLElement.prototype);

	var thatDoc = document;
	var thisDoc =	(thatDoc._currentScript || thatDoc.currentScript).ownerDocument;

	e.createdCallback = function () {
		var host = this;
		e.settings(host).populate(host).bind(host);
	};

	e.settings = function (host) {
		var i;
		var attrs = host.attributes;
		var l = attrs.length;
		var args = [];
		for (i = 0; i < l; i += 1) {
			var val = attrs[i].value;
			args[attrs[i].nodeName] = val !== '' ? val : true;
		}
		this.options = args;
		return e;
	};

	e.populate = function (host) {
		var self = this;
		var main = thisDoc.querySelector('.main').content;
		var mainclone = document.importNode(main, true);

		var navTemplate = thisDoc.querySelector('.nav').content;
		var contentTemplate = thisDoc.querySelector('.content').content;
		var nav = mainclone.querySelector('.tab-nav');
		var content = mainclone.querySelector('.tab-content');
		var tabs = host.querySelectorAll('div.tabcontent');
		var active = host.hasAttribute('active') ? host.getAttribute('active') : 0;

		host.createShadowRoot();

		Array.prototype.forEach.call(tabs, function (tab, i) {
			var clone;
			var li = navTemplate.querySelector('li');
			var pane = contentTemplate.querySelector('div.tab-panel');

			if (active === i) {
				li.classList.add('active');
				if (!host.hasAttribute('scroll')) {
					pane.classList.add('active');
				}
			} else {
				li.classList.remove('active');
				if (!host.hasAttribute('scroll')) {
					pane.classList.remove('active');
				}
			}

			li.innerHTML = tab.querySelector('h1').textContent;
			clone = document.importNode(li, true);
			nav.appendChild(clone);

			pane.querySelector('h1').innerHTML = tab.querySelector('h1').innerHTML;
			pane.querySelector('div').innerHTML = tab.querySelector('div').innerHTML;
			clone = document.importNode(contentTemplate, true);
			content.appendChild(clone);

			host.shadowRoot.appendChild(mainclone);

		});
		
		return e;
	};

	e.bind = function (host) {
		var self = this;
		var navElement = host.shadowRoot.querySelector('.tab-nav');
		var navItems = host.shadowRoot.querySelectorAll('.tab-nav > li');
		var tabs = host.shadowRoot.querySelectorAll('.tab-content > div');
		Array.prototype.forEach.call(navItems, function (item, i) {
			item.addEventListener('click', function (event) {
				e.setTab(host, event);
			});
		});
		if (host.hasAttribute('scroll')) {
			window.addEventListener('scroll', function () {
				e.setNavTop(host);
			});
			window.addEventListener('scroll', function () {
				e.updateScrollTab(host);
			});
		}
	};

	e.updateScrollTab = function (host) {
		var self = this;
		var tabs = host.shadowRoot.querySelectorAll('.tab-content > div');
		var navItems = host.shadowRoot.querySelectorAll('.tab-nav > li');
		var active = host.hasAttribute('active') ? host.getAttribute('active') : 0;
		Array.prototype.forEach.call(tabs, function (item, i) {
			if (e.isVisible(item)) {
				if (active !== i) {
					host.setAttribute('active', i);
					Array.prototype.forEach.call(navItems, function (item, i) {
						item.classList.remove('active');
					});
					navItems[i].classList.add('active');
				}
			}
		});
	};

	e.setNavTop = function (host) {
		var self = this;
		var navElement = host.shadowRoot.querySelector('.tab-nav');
		var scrolltop = document.body.scrollTop;
		var parent = navElement.parentNode.getBoundingClientRect().top;
		var parentTop = parent + document.body.scrollTop;
		var bottom = parent + navElement.parentNode.offsetHeight - navElement.offsetHeight;
		console.log(scrolltop, parentTop, bottom);
		if (scrolltop >= 0 && scrolltop >= parentTop && bottom > 0) {
			navElement.style.top = scrolltop - parentTop + 'px';
		} else if (scrolltop < 0) {
			navElement.style.top = '0px';
		}
	};

	e.setTab = function (host, event) {
		var self = this;
		var items = host.shadowRoot.querySelectorAll('.tab-nav > li');
		var tabs = host.shadowRoot.querySelectorAll('.tab-panel');

		Array.prototype.forEach.call(items, function (item, i) {
			if (item !== event.target && !host.hasAttribute('scroll')) {
				tabs[i].classList.remove('active');
			} else if (item === event.target) {
				if (!host.hasAttribute('scroll')) {
					tabs[i].classList.add('active');
				} else {
					var progress = function (p) {
						return 1 - Math.sin(Math.acos(p));
					};
					var start = document.body.scrollTop;
					var to = tabs[i].getBoundingClientRect().top + document.body.scrollTop;
					var distance = to - document.body.scrollTop;
					e.animate({
						delay: 0,
						duration: 200,
						delta: progress,
						step: function(delta) {
							var next = Math.ceil(start + (distance * delta));
						  window.scrollTo(0, next);
						}
					});
				}
			}
			item.classList.remove('active');
		});
		if (!host.hasAttribute('scroll')) {
			event.target.classList.add('active');
		}
	};

	e.animate = function (opts) {
		var start = new Date;
		var id = setInterval(function() {
			var timePassed = new Date - start;
			var progress = timePassed / opts.duration;
	
			if (progress > 1) {
				progress = 1;
			}
	
			var delta = opts.delta(progress);
			opts.step(delta);
	
			if (progress == 1) {
				clearInterval(id)
			}
		}, opts.delay);
	};

	e.isVisible = function (element) {
		var top = element.offsetTop;
		var bottom = element.offsetHeight + top;
		if (top <= (document.body.scrollTop) && document.body.scrollTop < bottom) {
			return true;
		}
	};

	window.tabPanel = document.registerElement('tab-panel', {
		prototype: e
	});

} (window, document));