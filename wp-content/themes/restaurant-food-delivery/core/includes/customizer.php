<?php

if ( class_exists("Kirki")){

	// LOGO

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'slider',
		'settings'    => 'restaurant_food_delivery_logo_resizer',
		'label'       => esc_html__( 'Adjust Your Logo Size ', 'restaurant-food-delivery' ),
		'section'     => 'title_tagline',
		'default'     => 70,
		'choices'     => [
			'min'  => 10,
			'max'  => 300,
			'step' => 10,
		],
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_enable_logo_text',
		'section'     => 'title_tagline',
			'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Enable / Disable Site Title and Tagline', 'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 10,
	] );

    Kirki::add_field( 'theme_config_id', [
		'type'        => 'switch',
		'settings'    => 'restaurant_food_delivery_display_header_title',
		'label'       => esc_html__( 'Site Title Enable / Disable Button', 'restaurant-food-delivery' ),
		'section'     => 'title_tagline',
		'default'     => '1',
		'priority'    => 10,
		'choices'     => [
			'on'  => esc_html__( 'Enable', 'restaurant-food-delivery' ),
			'off' => esc_html__( 'Disable', 'restaurant-food-delivery' ),
		],
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'switch',
		'settings'    => 'restaurant_food_delivery_display_header_text',
		'label'       => esc_html__( 'Tagline Enable / Disable Button', 'restaurant-food-delivery' ),
		'section'     => 'title_tagline',
		'default'     => '1',
		'priority'    => 10,
		'choices'     => [
			'on'  => esc_html__( 'Enable', 'restaurant-food-delivery' ),
			'off' => esc_html__( 'Disable', 'restaurant-food-delivery' ),
		],
	] );

	//FONT STYLE TYPOGRAPHY

	Kirki::add_panel( 'restaurant_food_delivery_panel_id', array(
	    'priority'    => 10,
	    'title'       => esc_html__( 'Typography', 'restaurant-food-delivery' ),
	) );

	Kirki::add_section( 'restaurant_food_delivery_font_style_section', array(
		'title'      => esc_attr__( 'Typography Option',  'restaurant-food-delivery' ),
		'priority'   => 2,
		'capability' => 'edit_theme_options',
	) );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_all_headings_typography',
		'section'     => 'restaurant_food_delivery_font_style_section',
			'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Heading Of All Sections',  'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 10,
	] );

	Kirki::add_field( 'global', array(
		'type'        => 'typography',
		'settings'    => 'restaurant_food_delivery_all_headings_typography',
		'label'       => esc_attr__( 'Heading Typography',  'restaurant-food-delivery' ),
		'description' => esc_attr__( 'Select the typography options for your heading.',  'restaurant-food-delivery' ),
		'help'        => esc_attr__( 'The typography options you set here will override the Body Typography options for all headers on your site (post titles, widget titles etc).',  'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_font_style_section',
		'priority'    => 10,
		'default'     => array(
			'font-family'    => '',
			'variant'        => '',
		),
		'output' => array(
			array(
				'element' => array( 'h1','h2','h3','h4','h5','h6', ),
			),
		),
	) );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_body_content_typography',
		'section'     => 'restaurant_food_delivery_font_style_section',
			'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Body Content',  'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 10,
	] );

	Kirki::add_field( 'global', array(
		'type'        => 'typography',
		'settings'    => 'restaurant_food_delivery_body_content_typography',
		'label'       => esc_attr__( 'Content Typography',  'restaurant-food-delivery' ),
		'description' => esc_attr__( 'Select the typography options for your body.',  'restaurant-food-delivery' ),
		'help'        => esc_attr__( 'The typography options you set here will override the Body Typography options for all headers on your site (post titles, widget titles etc).',  'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_font_style_section',
		'priority'    => 10,
		'default'     => array(
			'font-family'    => '',
			'variant'        => '',
		),
		'output' => array(
			array(
				'element' => array( 'body', ),
			),
		),
	) );


	// PANEL

	Kirki::add_panel( 'restaurant_food_delivery_panel_id', array(
	    'priority'    => 10,
	    'title'       => esc_html__( 'Theme Options', 'restaurant-food-delivery' ),
	) );

	// Scroll Top

	Kirki::add_section( 'restaurant_food_delivery_section_scroll', array(
	    'title'          => esc_html__( 'Additional Settings', 'restaurant-food-delivery' ),
	    'description'    => esc_html__( 'Scroll To Top', 'restaurant-food-delivery' ),
	    'panel'          => 'restaurant_food_delivery_panel_id',
	    'priority'       => 160,
	) );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'toggle',
		'settings'    => 'restaurant_food_delivery_scroll_enable_setting',
		'label'       => esc_html__( 'Here you can enable or disable your scroller.', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_section_scroll',
		'default'     => '1',
		'priority'    => 10,
	] );

	new \Kirki\Field\Select(
	[
		'settings'    => 'menu_text_transform_restaurant_food_delivery',
		'label'       => esc_html__( 'Menus Text Transform', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_section_scroll',
		'default'     => 'CAPITALISE',
		'placeholder' => esc_html__( 'Choose an option', 'restaurant-food-delivery' ),
		'choices'     => [
			'CAPITALISE' => esc_html__( 'CAPITALISE', 'restaurant-food-delivery' ),
			'UPPERCASE' => esc_html__( 'UPPERCASE', 'restaurant-food-delivery' ),
			'LOWERCASE' => esc_html__( 'LOWERCASE', 'restaurant-food-delivery' ),

		],
	]
	);

	// POST SECTION

	Kirki::add_section( 'restaurant_food_delivery_section_post', array(
	    'title'          => esc_html__( 'Post Settings', 'restaurant-food-delivery' ),
	    'description'    => esc_html__( 'Here you can get different post settings', 'restaurant-food-delivery' ),
	    'panel'          => 'restaurant_food_delivery_panel_id',
	    'priority'       => 160,
	) );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_enable_post_heading',
		'section'     => 'restaurant_food_delivery_section_post',
		'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Enable / Disable Post Settings.', 'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 10,
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'switch',
		'settings'    => 'restaurant_food_delivery_blog_admin_enable',
		'label'       => esc_html__( 'Post Author Enable / Disable Button', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_section_post',
		'default'     => '1',
		'priority'    => 10,
		'choices'     => [
			'on'  => esc_html__( 'Enable', 'restaurant-food-delivery' ),
			'off' => esc_html__( 'Disable', 'restaurant-food-delivery' ),
		],
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'switch',
		'settings'    => 'restaurant_food_delivery_blog_comment_enable',
		'label'       => esc_html__( 'Post Comment Enable / Disable Button', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_section_post',
		'default'     => '1',
		'priority'    => 10,
		'choices'     => [
			'on'  => esc_html__( 'Enable', 'restaurant-food-delivery' ),
			'off' => esc_html__( 'Disable', 'restaurant-food-delivery' ),
		],
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'slider',
		'settings'    => 'restaurant_food_delivery_post_excerpt_number',
		'label'       => esc_html__( 'Post Content Range', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_section_post',
		'default'     => 15,
		'choices'     => [
			'min'  => 0,
			'max'  => 100,
			'step' => 1,
		],
	] );

	// HEADER SECTION

	Kirki::add_section( 'restaurant_food_delivery_section_header', array(
	    'title'          => esc_html__( 'Header Settings', 'restaurant-food-delivery' ),
	    'description'    => esc_html__( 'Here you can add header information.', 'restaurant-food-delivery' ),
	    'panel'          => 'restaurant_food_delivery_panel_id',
	    'priority'       => 160,
	) );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_enable_button',
		'section'     => 'restaurant_food_delivery_section_header',
			'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Sign Up Button', 'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 10,
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'     => 'text',
		'label'       => esc_html__( 'Text 2', 'restaurant-food-delivery' ),
		'settings' => 'restaurant_food_delivery_return_policy_text',
		'section'  => 'restaurant_food_delivery_section_header',
		'default'  => '',
		'priority' => 10,
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'     => 'url',
		'label'       => esc_html__( 'URL 2', 'restaurant-food-delivery' ),
		'settings' => 'restaurant_food_delivery_return_policy_link',
		'section'  => 'restaurant_food_delivery_section_header',
		'default'  => '',
		'priority' => 10,
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_enable_search',
		'section'     => 'restaurant_food_delivery_section_header',
			'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Enable / Disable Search Box', 'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 10,
	] );

    Kirki::add_field( 'theme_config_id', [
		'type'        => 'switch',
		'settings'    => 'restaurant_food_delivery_search_box_enable',
		'section'     => 'restaurant_food_delivery_section_header',
		'default'     => '1',
		'priority'    => 10,
		'choices'     => [
			'on'  => esc_html__( 'Enable', 'restaurant-food-delivery' ),
			'off' => esc_html__( 'Disable', 'restaurant-food-delivery' ),
		],
	] );

	// SLIDER SECTION

	Kirki::add_section( 'restaurant_food_delivery_blog_slide_section', array(
        'title'          => esc_html__( ' Slider Settings', 'restaurant-food-delivery' ),
        'description'    => esc_html__( 'You have to select post category to show slider.', 'restaurant-food-delivery' ),
        'panel'          => 'restaurant_food_delivery_panel_id',
        'priority'       => 160,
    ) );

    Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_enable_heading',
		'section'     => 'restaurant_food_delivery_blog_slide_section',
			'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Enable / Disable Slider', 'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 10,
	] );

    Kirki::add_field( 'theme_config_id', [
		'type'        => 'switch',
		'settings'    => 'restaurant_food_delivery_blog_box_enable',
		'label'       => esc_html__( 'Section Enable / Disable', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_blog_slide_section',
		'default'     => '0',
		'priority'    => 10,
		'choices'     => [
			'on'  => esc_html__( 'Enable', 'restaurant-food-delivery' ),
			'off' => esc_html__( 'Disable', 'restaurant-food-delivery' ),
		],
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'switch',
		'settings'    => 'restaurant_food_delivery_title_unable_disable',
		'label'       => esc_html__( 'Slide Title Enable / Disable', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_blog_slide_section',
		'default'     => '1',
		'priority'    => 10,
		'choices'     => [
			'on'  => esc_html__( 'Enable', 'restaurant-food-delivery' ),
			'off' => esc_html__( 'Disable', 'restaurant-food-delivery' ),
		],
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'switch',
		'settings'    => 'restaurant_food_delivery_button_unable_disable',
		'label'       => esc_html__( 'Slide Button Enable / Disable', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_blog_slide_section',
		'default'     => '1',
		'priority'    => 10,
		'choices'     => [
			'on'  => esc_html__( 'Enable', 'restaurant-food-delivery' ),
			'off' => esc_html__( 'Disable', 'restaurant-food-delivery' ),
		],
	] );

    Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_slider_heading',
		'section'     => 'restaurant_food_delivery_blog_slide_section',
			'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Slider', 'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 10,
	] );

    Kirki::add_field( 'theme_config_id', [
		'type'        => 'number',
		'settings'    => 'restaurant_food_delivery_blog_slide_number',
		'label'       => esc_html__( 'Number of slides to show', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_blog_slide_section',
		'default'     => 3,
		'choices'     => [
			'min'  => 0,
			'max'  => 80,
			'step' => 1,
		],
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'select',
		'settings'    => 'restaurant_food_delivery_blog_slide_category',
		'label'       => esc_html__( 'Select the category to show slider ( Image Dimension 1600 x 600 )', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_blog_slide_section',
		'default'     => '',
		'placeholder' => esc_html__( 'Select an category...', 'restaurant-food-delivery' ),
		'priority'    => 10,
		'choices'     => restaurant_food_delivery_get_categories_select(),
	] );

	//SPECIAL MEAL SECTION

	Kirki::add_section( 'restaurant_food_delivery_special_meal_section', array(
	    'title'          => esc_html__( 'Special Meal Settings', 'restaurant-food-delivery' ),
	    'description'    => esc_html__( 'Here you can add different type of social icons.', 'restaurant-food-delivery' ),
	    'panel'          => 'restaurant_food_delivery_panel_id',
	    'priority'       => 160,
	) );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_enable_heading',
		'section'     => 'restaurant_food_delivery_special_meal_section',
			'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Enable / Disable Special Meal',  'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 1,
	] );

	Kirki::add_field( 'theme_config_id', [
		'type'        => 'switch',
		'settings'    => 'restaurant_food_delivery_special_meal_section_enable',
		'label'       => esc_html__( 'Section Enable / Disable',  'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_special_meal_section',
		'default'     => '0',
		'priority'    => 2,
		'choices'     => [
			'on'  => esc_html__( 'Enable',  'restaurant-food-delivery' ),
			'off' => esc_html__( 'Disable',  'restaurant-food-delivery' ),
		],
	] );

	Kirki::add_field( 'theme_config_id', [
        'type'     => 'text',
        'settings' => 'restaurant_food_delivery_special_meal_heading' ,
        'label'    => esc_html__( 'Heading',  'restaurant-food-delivery' ),
        'section'  => 'restaurant_food_delivery_special_meal_section',
    ] );

    kirki::add_field( 'theme_config_id', [
		'type'        => 'number',
		'settings'    => 'restaurant_food_delivery_special_meal_tab_number',
		'label'       => esc_html__( 'Number of post to show ',  'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_special_meal_section',
		'default'     => 4,
		'choices'     => [
			'min'  => 0,
			'max'  => 80,
			'step' => 1,
		],
	] );

	// FOOTER SECTION

	Kirki::add_section( 'restaurant_food_delivery_footer_section', array(
        'title'          => esc_html__( 'Footer Settings', 'restaurant-food-delivery' ),
        'description'    => esc_html__( 'Here you can change copyright text', 'restaurant-food-delivery' ),
        'panel'          => 'restaurant_food_delivery_panel_id',
        'priority'       => 160,
    ) );

    Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_footer_text_heading',
		'section'     => 'restaurant_food_delivery_footer_section',
			'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Footer Copyright Text', 'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 10,
	] );

    Kirki::add_field( 'theme_config_id', [
		'type'     => 'text',
		'settings' => 'restaurant_food_delivery_footer_text',
		'section'  => 'restaurant_food_delivery_footer_section',
		'default'  => '',
		'priority' => 10,
	] );

    Kirki::add_field( 'theme_config_id', [
		'type'        => 'custom',
		'settings'    => 'restaurant_food_delivery_footer_enable_heading',
		'section'     => 'restaurant_food_delivery_footer_section',
			'default'         => '<h3 style="color: #2271b1; padding:10px; background:#fff; margin:0; border-left: solid 5px #2271b1; ">' . __( 'Enable / Disable Footer Link', 'restaurant-food-delivery' ) . '</h3>',
		'priority'    => 10,
	] );

    Kirki::add_field( 'theme_config_id', [
		'type'        => 'switch',
		'settings'    => 'restaurant_food_delivery_copyright_enable',
		'label'       => esc_html__( 'Section Enable / Disable', 'restaurant-food-delivery' ),
		'section'     => 'restaurant_food_delivery_footer_section',
		'default'     => '1',
		'priority'    => 10,
		'choices'     => [
			'on'  => esc_html__( 'Enable', 'restaurant-food-delivery' ),
			'off' => esc_html__( 'Disable', 'restaurant-food-delivery' ),
		],
	] );
}

add_action( 'customize_register', 'restaurant_food_delivery_customizer_settings' );
function restaurant_food_delivery_customizer_settings( $wp_customize ) {
	$wp_customize->add_setting('restaurant_food_delivery_special_meal_tab_number',array(
		'default' => '',
		'sanitize_callback' => 'sanitize_text_field',
	));
	$wp_customize->add_control('restaurant_food_delivery_special_meal_tab_number',array(
		'type' => 'number',
		'label' => __('Show number of product tab','restaurant-food-delivery'),
		'section' => 'restaurant_food_delivery_special_meal_section',
	));

	$meal_post = get_theme_mod('restaurant_food_delivery_special_meal_tab_number','');
    for ( $j = 1; $j <= $meal_post; $j++ ) {

		$wp_customize->add_setting('restaurant_food_delivery_special_meal_tabs_text'.$j,array(
			'default' => '',
			'sanitize_callback' => 'sanitize_text_field',
		));
		$wp_customize->add_control('restaurant_food_delivery_special_meal_tabs_text'.$j,array(
			'type' => 'text',
			'label' => __('Tab Text ','restaurant-food-delivery').$j,
			'section' => 'restaurant_food_delivery_special_meal_section',
		));

		$args = array(
	       'type'                     => 'product',
	        'child_of'                 => 0,
	        'parent'                   => '',
	        'orderby'                  => 'term_group',
	        'order'                    => 'ASC',
	        'hide_empty'               => false,
	        'hierarchical'             => 1,
	        'number'                   => '',
	        'taxonomy'                 => 'product_cat',
	        'pad_counts'               => false
	    );
		$categories = get_categories($args);
		$cat_posts = array();
		$m = 0;
		$cat_posts[]='Select';
		foreach($categories as $category){
			if($m==0){
				$default = $category->slug;
				$m++;
			}
			$cat_posts[$category->slug] = $category->name;
		}

		$wp_customize->add_setting('restaurant_food_delivery_special_meal_category'.$j,array(
			'default'	=> 'select',
			'sanitize_callback' => 'restaurant_food_delivery_sanitize_select',
		));

		$wp_customize->add_control('restaurant_food_delivery_special_meal_category'.$j,array(
			'type'    => 'select',
			'choices' => $cat_posts,
			'label' => __('Select category to display products ','restaurant-food-delivery').$j,
			'section' => 'restaurant_food_delivery_special_meal_section',
		));
	}
}
