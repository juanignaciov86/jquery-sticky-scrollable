var bindMoreLessToggles = function (){

		$(document).on("click",".js-shop-stores-facet .js-facet-change-link",function(e){
			e.preventDefault();
			$(".js-shop-stores-facet .js-facet-container").hide();
			$(".js-shop-stores-facet .js-facet-form").show();
		});


		$(document).on("change",".js-product-facet .js-facet-checkbox",function(){
			$(this).parents("form").submit();
		});

		$(document).on("click",".js-product-facet .js-more-facet-values-link",function(e){
			e.preventDefault();
			$(this).parents(".js-facet").find(".js-facet-top-values").hide();
			$(this).parents(".js-facet").find(".js-facet-list-hidden").show();

			$(this).parents(".js-facet").find(".js-more-facet-values").hide();
			$(this).parents(".js-facet").find(".js-less-facet-values").css('display','block');
		});

		$(document).on("click",".js-product-facet .js-less-facet-values-link",function(e){
			e.preventDefault();
			$(this).parents(".js-facet").find(".js-facet-top-values").show();
			$(this).parents(".js-facet").find(".js-facet-list-hidden").hide();

			$(this).parents(".js-facet").find(".js-more-facet-values").show();
			$(this).parents(".js-facet").find(".js-less-facet-values").hide();
		});

};

bindMoreLessToggles();
