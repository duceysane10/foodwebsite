<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>

<meta http-equiv="Content-Type" content="<?php echo esc_attr(get_bloginfo('html_type')); ?>; charset=<?php echo esc_attr(get_bloginfo('charset')); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.2, user-scalable=yes" />

<?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>

<?php
	if ( function_exists( 'wp_body_open' ) )
	{
		wp_body_open();
	}else{
		do_action('wp_body_open');
	}
?>

<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'restaurant-food-delivery' ); ?></a>

<header id="site-navigation" class="header text-center text-md-left py-2">
	<div class="container-fluid">
		<div class="row">
			<div class="col-lg-2 col-md-4 col-sm-4 align-self-center">
				<div class="logo">
		    		<div class="logo-image">
		    			<?php echo esc_url( the_custom_logo() ); ?>
			    	</div>
			    	<div class="logo-content">
				    	<?php
				    		if ( get_theme_mod('restaurant_food_delivery_display_header_title', true) == true ) :
					      		echo '<a href="' . esc_url(home_url('/')) . '" title="' . esc_attr(get_bloginfo('name')) . '">';
					      			echo esc_attr(get_bloginfo('name'));
					      		echo '</a>';
					      	endif;

					      	if ( get_theme_mod('restaurant_food_delivery_display_header_text', true) == true ) :
				      			echo '<span>'. esc_attr(get_bloginfo('description')) . '</span>';
				      		endif;
			    		?>
					</div>
				</div>
		   	</div>
			<div class="col-lg-6 col-md-8 col-sm-8 align-self-center">
				<?php if(has_nav_menu('main-menu')){ ?>
					<button class="menu-toggle my-2 py-2 px-3" aria-controls="top-menu" aria-expanded="false" type="button">
						<span aria-hidden="true"><?php esc_html_e( 'Menu', 'restaurant-food-delivery' ); ?></span>
					</button>
					<nav id="main-menu" class="close-panal">
						<?php
							wp_nav_menu( array(
								'theme_location' => 'main-menu',
								'container' => 'false'
							));
						?>
						<button class="close-menu my-2 p-2" type="button">
							<span aria-hidden="true"><i class="fa fa-times"></i></span>
						</button>
					</nav>
				<?php }?>
			</div>
			<div class="col-lg-2 col-md-6 col-sm-6 align-self-center">
				<div class="header-search text-center text-md-right py-3 py-md-0">
		        	<?php if ( get_theme_mod('restaurant_food_delivery_search_box_enable', true) == true ) : ?>
						<?php if(class_exists('woocommerce')){ ?>
				          	<form method="get" class="woocommerce-product-search" action="<?php echo esc_url(home_url('/')); ?>">
					            <label class="screen-reader-text" for="woocommerce-product-search-field"><?php esc_html_e('Search for:', 'restaurant-food-delivery'); ?></label>
					            <input type="search" id="woocommerce-product-search-field" class="search-field " placeholder="<?php echo esc_html('Search Here','restaurant-food-delivery'); ?>" value="<?php echo get_search_query(); ?>" name="s"/>
					            <button type="submit" value="" class="search-button"><i class="fas fa-search"></i></button>
					            <input type="hidden" name="post_type" value="product"/>
				          	</form>
				        <?php }?>
		        	<?php endif; ?>
		        </div>
	       	</div>
	       	<div class="col-lg-1 col-md-3 col-sm-3 col-6 align-self-center text-center text-md-right">
				<?php if ( get_theme_mod('restaurant_food_delivery_cart_box_enable', true) == true ) : ?>
					<?php if ( class_exists( 'woocommerce' ) ) {?>
						<a class="cart-customlocation" href="<?php if(function_exists('wc_get_cart_url')){ echo esc_url(wc_get_cart_url()); } ?>" title="<?php esc_attr_e( 'View Shopping Cart','restaurant-food-delivery' ); ?>"><i class="fas fa-shopping-cart"></i><span class="cart-item-box"><?php echo esc_html(wp_kses_data( WC()->cart->get_cart_contents_count() ));?></span></a>
					<?php }?>
				<?php endif; ?>
			</div>
			<div class="col-lg-1 col-md-3 col-sm-3 col-6 align-self-center text-center text-md-right mb-3 mb-md-0">
				<?php if ( get_theme_mod('restaurant_food_delivery_free_delivery_link') || get_theme_mod('restaurant_food_delivery_free_delivery_text') ) : ?>
					<a href="<?php echo esc_url( get_theme_mod('restaurant_food_delivery_free_delivery_link' ) ); ?>" class="myacunt-url"><?php echo esc_html( get_theme_mod('restaurant_food_delivery_free_delivery_text' ) ); ?></a>
				<?php endif; ?>
			</div>
	   	</div>
	</div>
</header>