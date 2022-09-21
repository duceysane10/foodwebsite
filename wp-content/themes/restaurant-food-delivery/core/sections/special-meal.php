<?php if ( get_theme_mod('restaurant_food_delivery_special_meal_section_enable') ) : ?>
	<div id="special-meal" class="py-5">
		<div class="container">
			<?php if ( get_theme_mod('restaurant_food_delivery_special_meal_heading') ) : ?>
          		<h2 class="text-center"><?php echo esc_html(get_theme_mod('restaurant_food_delivery_special_meal_heading'));?></h2>
          	<?php endif; ?>
          	<div class="tab">
				<div class="tab-section">
					<ul class="my-4">
				        <?php 
							$meal_post = get_theme_mod('restaurant_food_delivery_special_meal_tab_number', '');
							for ( $i = 1; $i <= $meal_post; $i++ ){ ?>
						 	<li class="product-tab align-self-center">
					            <button class="tablinks" onclick="restaurant_food_delivery_openCity(event, '<?php $main_id = get_theme_mod('restaurant_food_delivery_special_meal_tabs_text'.$i); $tab_id = str_replace(' ', '-', $main_id); echo $tab_id; ?> ')">
				              		<?php echo esc_html(get_theme_mod('restaurant_food_delivery_special_meal_tabs_text'.$i)); ?>
					            </button>
					        </li>
				        <?php }?>
				    </ul>
		        </div>
			</div>

 		    <?php for ( $i = 1; $i <= $meal_post; $i++ ){ ?>
		        <div id="<?php $main_id = get_theme_mod('restaurant_food_delivery_special_meal_tabs_text'.$i); $tab_id = str_replace(' ', '-', $main_id); echo $tab_id; ?>" class="tabcontent mt-3">
			        <div class="owl-carousel">
			            <?php
			            $restaurant_food_delivery_catData = get_theme_mod('restaurant_food_delivery_special_meal_category'.$i);
			            if ( class_exists( 'WooCommerce' ) ) {
			              $args = array( 
			                'post_type' => 'product',
			                'posts_per_page' => 8,
			                'product_cat' => $restaurant_food_delivery_catData,
			                'order' => 'ASC'
			              );
			              $loop = new WP_Query( $args );
			              while ( $loop->have_posts() ) : $loop->the_post(); global $product; ?>
			                <div class="tab-product">
			                    <div class="product-image box">
			                    	<figure class="mb-0">
			                        	<?php if (has_post_thumbnail( $loop->post->ID )) echo get_the_post_thumbnail($loop->post->ID, 'shop_catalog'); else echo '<img src="'.esc_url(woocommerce_placeholder_img_src()).'" />'; ?>
			                        	<?php if (   has_post_thumbnail() ) { ?>      
				                            <?php woocommerce_show_product_sale_flash( $post, $product ); ?>
				                        <?php }?>
			                        </figure>
			                        <div class="box-content intro-button ">
					                    <?php if( $product->is_type( 'simple' ) ) { woocommerce_template_loop_add_to_cart(  $loop->post, $product );} ?>
					                </div>
			                    </div>
			                    <div class="product-details p-3">
			                    	<?php if( $product->is_type( 'simple' ) ){ woocommerce_template_loop_rating( $loop->post, $product ); } ?>
				                  	<h5 class="product-text my-2 "><a href="<?php echo esc_url(get_permalink( $loop->post->ID )); ?>"><?php the_title(); ?></a></h5>
				                  	<h6 class="<?php echo esc_attr( apply_filters( 'woocommerce_product_price_class', 'price' ) ); ?> mb-0"><?php echo $product->get_price_html(); ?></h6>	                  	
				                </div>
			                </div>
			              <?php endwhile; wp_reset_query(); ?>
			            <?php } ?>
			        </div>
		        </div>
			<?php }?>
		</div>
	</div>
<?php endif; ?>