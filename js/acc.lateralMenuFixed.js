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
				// var options = {
				// 	offsetTop: options.offsetTop,
				// 	stickyEl: $el,
				// 	container: options.container
				// };
				mainObject.lastContHeight = $(options.container).outerHeight();
				$(window).scroll(mainObject.fixedOnScroll.bind(mainObject, $el, options));
			}
		};
		mainObject.windowScroll(this, options);
	};
})($);


$("#product-facet").stickyMenu({
	container: ".search--results--filters",
	offsetTop: $(".navigation--middle").outerHeight()
});
