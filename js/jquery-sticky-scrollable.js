(function ($) {
	$.fn.stickyMenu = function(options) {
		var mainObject = {
			scrollDirection: 0,
			lastContHeight: 0,
			lastTopSticky: 0,
			lastScrollTop: 0,
			lastDirection: 0,

			min: function (elements) {
				var minimum = elements[0];
				elements.forEach(function (item) {
					if(item < minimum) {
						minimum = item;
					}
				});
				return minimum;
			},

			max: function (elements) {
				var maximum = elements[0];
				elements.forEach(function (item) {
					if(item > maximum) {
						maximum = item;
					}
				});
				return maximum;
			},

			checkResize: function ($el, callback) {
				$el.addResizeListener(callback);
			},

			resizeCallback: function (options) {
				var $el = this;
				var $container = $el.closest(options.container);
				var offsetBottom = $el.offset().top + $el.height();
				var containerOffsetBottom = $container.offset().top + $container.height();
				if(offsetBottom > containerOffsetBottom) {
					$el.css({
						"position": "absolute",
						"bottom": "0px",
						"top": ""
					});
					return;
				} else {
					var offsetTop = $el.offset().top;
					var containerOffsetTop = $container.offset().top;
					if(offsetTop > $(window).scrollTop()) {
						$el.css({
							"position": "absolute",
							"bottom": "",
							"top": mainObject.max([$(window).scrollTop()  - (containerOffsetTop - options.offsetTop), 0]),
						});
					}
				}
				$(window).scroll();
			},

			fixedOnScroll: function ($el, options) {
				var stickyMenu = $el;
				var offsetTop = options.offsetTop;
				var containerOfMenu = stickyMenu.closest(options.container);
				containerOfMenu.css("position", "");
				stickyMenu.css("width", containerOfMenu.width());
				var menuHeight = stickyMenu.outerHeight();
				var menuContainerHeight = containerOfMenu.outerHeight();
				var visibleMenuContainerHeight = this.inViewport(containerOfMenu);
				var menuFits = menuHeight < $(window).height() - offsetTop;
				var menuContainerBottomOffset = containerOfMenu.offset().top + containerOfMenu.outerHeight();
				var rebasedMaxMenuOffsetTop = containerOfMenu.offset().top - $(window).scrollTop() - offsetTop > 0;
				var windowOffsetBottom = $(window).scrollTop() + $(window).height();

				if(this.lastContHeight != menuContainerHeight) {
					stickyMenu.css({
						"top": this.lastTopSticky,
						"bottom": ""
					});
					this.lastContHeight = menuContainerHeight;
					return;
				}

				if(menuFits) {
					containerOfMenu.css("position", "relative");
					if(stickyMenu.offset().top + stickyMenu.outerHeight() >= menuContainerBottomOffset && menuHeight > visibleMenuContainerHeight - offsetTop) {
						stickyMenu.css({
							position: "absolute",
							bottom: "0px",
							top: ""
						});
					} else {
						if(!rebasedMaxMenuOffsetTop) {
							stickyMenu.css({
								position: "absolute",
								top: $(window).scrollTop()  - (containerOfMenu.offset().top - offsetTop),
								bottom: ""
							});
						} else {
							stickyMenu.css({
								position: "",
								top: "",
								bottom: ""
							});
						}
					}
				} else {
					st = $(window).scrollTop();
					if(st < this.lastScrollTop) {
						this.lastDirection = 1;
					}
					else {
						if(st != this.lastScrollTop) {
							this.lastDirection = 0;
						}
					}
					this.lastScrollTop = st;
					containerOfMenu.css("position", "relative");
					if(!!this.lastDirection) {
						if(stickyMenu.offset().top - offsetTop >= $(window).scrollTop()) {
							if(rebasedMaxMenuOffsetTop) {
								stickyMenu.css({
									top: "",
									bottom: "",
									position: "static"
								});
							} else {
								stickyMenu.css({
									top: $(window).scrollTop()  - (containerOfMenu.offset().top - offsetTop),
									bottom: "",
									position: "absolute"
								});
							}
						}
					} else {
						if(stickyMenu.offset().top + stickyMenu.outerHeight() <= windowOffsetBottom) {
							if(windowOffsetBottom - stickyMenu.outerHeight() > menuContainerBottomOffset - stickyMenu.outerHeight()) {
								stickyMenu.css({
									position: "absolute",
									bottom: "0px",
									top: ""
								});
							} else {
								stickyMenu.css({
									position: "absolute",
									top: this.min([windowOffsetBottom - stickyMenu.outerHeight(), menuContainerBottomOffset - stickyMenu.outerHeight()]) - containerOfMenu.offset().top,
									bottom: ""
								});
							}
						} else {
							if (stickyMenu.offset().top + stickyMenu.outerHeight() > menuContainerBottomOffset) {
								stickyMenu.css({
									position: "absolute",
									bottom: "0px",
									top: ""
								});
							}
						}
					}
				}
				this.lastContHeight = menuContainerHeight;
				this.lastTopSticky = stickyMenu.css("top");
			},

			inViewport: function($el) {
				var elH = $el.outerHeight(),
				H   = $(window).height(),
				r   = $el[0].getBoundingClientRect(), t=r.top, b=r.bottom;
				return Math.max(0, t>0? Math.min(elH, H-t) : (b<H?b:H));
			},

			windowScroll: function($el, options) {
				mainObject.lastContHeight = $(options.container).outerHeight();
				$(window).scroll(mainObject.fixedOnScroll.bind(mainObject, $el, options));
				$(window).scroll();
			}
		};

		options.offsetTop = options.offsetTop || 0;
		mainObject.windowScroll(this, options);
		if(!!options.resizable) {
			if(!this.addResizeListener) {
				console.log("note: you have to incluide jquery-resize-detect library first to resizable menu");
			} else {
				mainObject.checkResize(this, mainObject.resizeCallback.bind(this, options));
			}
		}
		var container = $(options.container) || this.parent();
		container.css("overflow", "hidden");
		// for chrome scroll animation
		$("body").append( "<div style='position: fixed'></div>" );
	};
})($);
