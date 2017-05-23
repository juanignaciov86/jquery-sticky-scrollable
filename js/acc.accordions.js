var	lateralMenuCategoryPage = function () {
	$('[data-accordion]').accordion({
		singleOpen: false
	});

	$(".js-facet-values").each(function () {
		if($(this).find( "input:checked" ).length) {
			$(this).prevAll("[data-control]").click();
		}
	});

};

lateralMenuCategoryPage();
