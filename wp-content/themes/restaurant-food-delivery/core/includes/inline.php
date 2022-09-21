<?php


$restaurant_food_delivery_custom_css = '';

	/*---------------------------text-transform-------------------*/
	
	$restaurant_food_delivery_text_transform = get_theme_mod( 'menu_text_transform_restaurant_food_delivery','CAPITALISE');
    if($restaurant_food_delivery_text_transform == 'CAPITALISE'){

		$restaurant_food_delivery_custom_css .='#main-menu ul li a{';

			$restaurant_food_delivery_custom_css .='text-transform: capitalize ; font-size: 14px !important;';

		$restaurant_food_delivery_custom_css .='}';

	}else if($restaurant_food_delivery_text_transform == 'UPPERCASE'){

		$restaurant_food_delivery_custom_css .='#main-menu ul li a{';

			$restaurant_food_delivery_custom_css .='text-transform: uppercase ; font-size: 14px !important ;';

		$restaurant_food_delivery_custom_css .='}';

	}else if($restaurant_food_delivery_text_transform == 'LOWERCASE'){

		$restaurant_food_delivery_custom_css .='#main-menu ul li a{';

			$restaurant_food_delivery_custom_css .='text-transform: lowercase ; font-size: 14px !important';

		$restaurant_food_delivery_custom_css .='}';
	}

	