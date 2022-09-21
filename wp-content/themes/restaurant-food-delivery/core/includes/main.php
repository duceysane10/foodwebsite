<?php

add_action( 'admin_menu', 'restaurant_food_delivery_getting_started' );
function restaurant_food_delivery_getting_started() {    	    	
	add_theme_page( esc_html__('Get Started', 'restaurant-food-delivery'), esc_html__('Get Started', 'restaurant-food-delivery'), 'edit_theme_options', 'restaurant-food-delivery-guide-page', 'restaurant_food_delivery_test_guide');   
}

function restaurant_food_delivery_admin_enqueue_scripts() {
	wp_enqueue_style( 'restaurant-food-delivery-admin-style', esc_url( get_template_directory_uri() ).'/css/main.css' );
}
add_action( 'admin_enqueue_scripts', 'restaurant_food_delivery_admin_enqueue_scripts' );

if ( ! defined( 'RESTAURANT_FOOD_DELIVERY_DOCS_FREE' ) ) {
define('RESTAURANT_FOOD_DELIVERY_DOCS_FREE',__('https://www.misbahwp.com/docs/restaurant-food-delivery-free-docs/','restaurant-food-delivery'));
}
if ( ! defined( 'RESTAURANT_FOOD_DELIVERY_DOCS_PRO' ) ) {
define('RESTAURANT_FOOD_DELIVERY_DOCS_PRO',__('https://www.misbahwp.com/docs/restaurant-food-delivery-pro-docs','restaurant-food-delivery'));
}
if ( ! defined( 'RESTAURANT_FOOD_DELIVERY_BUY_NOW' ) ) {
define('RESTAURANT_FOOD_DELIVERY_BUY_NOW',__('https://www.misbahwp.com/themes/food-delivery-wordpress-theme/','restaurant-food-delivery'));
}
if ( ! defined( 'RESTAURANT_FOOD_DELIVERY_SUPPORT_FREE' ) ) {
define('RESTAURANT_FOOD_DELIVERY_SUPPORT_FREE',__('https://wordpress.org/support/theme/restaurant-food-delivery','restaurant-food-delivery'));
}
if ( ! defined( 'RESTAURANT_FOOD_DELIVERY_REVIEW_FREE' ) ) {
define('RESTAURANT_FOOD_DELIVERY_REVIEW_FREE',__('https://wordpress.org/support/theme/restaurant-food-delivery/reviews/#new-post','restaurant-food-delivery'));
}
if ( ! defined( 'RESTAURANT_FOOD_DELIVERY_DEMO_PRO' ) ) {
define('RESTAURANT_FOOD_DELIVERY_DEMO_PRO',__('https://www.misbahwp.com/demo/food-delivery-restaurant/','restaurant-food-delivery'));
}

function restaurant_food_delivery_test_guide() { ?>
	<?php $theme = wp_get_theme(); ?>
	<div class="wrap" id="main-page">
		<div id="lefty">
			<div id="admin_links">
				<a href="<?php echo esc_url( RESTAURANT_FOOD_DELIVERY_DOCS_FREE ); ?>" target="_blank" class="blue-button-1"><?php esc_html_e( 'Documentation', 'restaurant-food-delivery' ) ?></a>			
				<a href="<?php echo esc_url( admin_url('customize.php') ); ?>" id="customizer" target="_blank"><?php esc_html_e( 'Customize', 'restaurant-food-delivery' ); ?> </a>
				<a class="blue-button-1" href="<?php echo esc_url( RESTAURANT_FOOD_DELIVERY_SUPPORT_FREE ); ?>" target="_blank" class="btn3"><?php esc_html_e( 'Support', 'restaurant-food-delivery' ) ?></a>
				<a class="blue-button-2" href="<?php echo esc_url( RESTAURANT_FOOD_DELIVERY_REVIEW_FREE ); ?>" target="_blank" class="btn4"><?php esc_html_e( 'Review', 'restaurant-food-delivery' ) ?></a>
			</div>
			<div id="description">
				<h3><?php esc_html_e('Welcome! Thank you for choosing ','restaurant-food-delivery'); ?><?php echo esc_html( $theme ); ?>  <span><?php esc_html_e('Version: ', 'restaurant-food-delivery'); ?><?php echo esc_html($theme['Version']);?></span></h3>
				<img class="img_responsive" style="width:100%;" src="<?php echo esc_url( get_template_directory_uri() ); ?>/screenshot.png">
				<div id="description-inside">
					<?php
						$theme = wp_get_theme();
						echo wp_kses_post( apply_filters( 'misbah_theme_description', esc_html( $theme->get( 'Description' ) ) ) );
					?>
				</div>
			</div>
		</div>
		<div id="righty">
			<div class="postbox donate">
				<div class="d-table">
			    <ul class="d-column">
			      <li class="feature"><?php esc_html_e('Features','restaurant-food-delivery'); ?></li>
			      <li class="free"><?php esc_html_e('Pro','restaurant-food-delivery'); ?></li>
			      <li class="plus"><?php esc_html_e('Free','restaurant-food-delivery'); ?></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('24hrs Priority Support','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-yes"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('Kirki Framework','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-yes"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('One Click Demo Import','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-no"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('Secton Reordering','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-no"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('Enable / Disable Option','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-yes"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('Advance Posttype','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-no"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('Multiple Sections','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-no"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('Advance Color Pallete','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-no"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('Advance Widgets','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-yes"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('Page Templates','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-no"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('Advance Typography','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-no"></span></li>
			    </ul>
			    <ul class="d-row">
			      <li class="points"><?php esc_html_e('Section Background Image / Color ','restaurant-food-delivery'); ?></li>
			      <li class="right"><span class="dashicons dashicons-yes"></span></li>
			      <li class="wrong"><span class="dashicons dashicons-no"></span></li>
			    </ul>		    
	  		</div>
				<h3 class="hndle"><?php esc_html_e( 'Upgrade to Premium', 'restaurant-food-delivery' ); ?></h3>
				<div class="inside">
					<p><?php esc_html_e('Discover upgraded pro features with premium version click to upgrade.','restaurant-food-delivery'); ?></p>
					<div id="admin_pro_links">			
						<a class="blue-button-2" href="<?php echo esc_url( RESTAURANT_FOOD_DELIVERY_BUY_NOW ); ?>" target="_blank"><?php esc_html_e( 'Go Pro', 'restaurant-food-delivery' ); ?></a>
						<a class="blue-button-1" href="<?php echo esc_url( RESTAURANT_FOOD_DELIVERY_DEMO_PRO ); ?>" target="_blank"><?php esc_html_e( 'Live Demo', 'restaurant-food-delivery' ) ?></a>
						<a class="blue-button-2" href="<?php echo esc_url( RESTAURANT_FOOD_DELIVERY_DOCS_PRO ); ?>" target="_blank"><?php esc_html_e( 'Pro Docs', 'restaurant-food-delivery' ) ?></a>
					</div>
				</div>
			</div>
		</div>
	</div>

<?php } ?>
