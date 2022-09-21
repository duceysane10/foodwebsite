<?php if ( get_theme_mod('restaurant_food_delivery_blog_box_enable') ) : ?>

<?php $args = array(
  'post_type' => 'post',
  'post_status' => 'publish',
  'category_name' =>  get_theme_mod('restaurant_food_delivery_blog_slide_category'),
  'posts_per_page' => get_theme_mod('restaurant_food_delivery_blog_slide_number'),
); ?>

<div class="slider">
  <div class="owl-carousel">
    <?php $arr_posts = new WP_Query( $args );
    if ( $arr_posts->have_posts() ) :
      while ( $arr_posts->have_posts() ) :
        $arr_posts->the_post();
        ?>
        <div class="blog_inner_box">
          <?php
            if ( has_post_thumbnail() ) :
              the_post_thumbnail();
            endif;
          ?>
          <div class="blog_box pt-3 pt-md-0">
            <?php if ( get_theme_mod('restaurant_food_delivery_title_unable_disable',true) ) : ?>
            <h3 class="my-3"><?php the_title(); ?></a></h3>
            <?php endif; ?>
            <p class="slider-text"><?php echo wp_trim_words( get_the_content(), get_theme_mod('restaurant_food_delivery_post_excerpt_number',30) ); ?><p>
            <?php if ( get_theme_mod('restaurant_food_delivery_button_unable_disable',true) ) : ?>
            <p class="slider-button mt-4">
              <a href="<?php echo esc_url(get_permalink($post->ID)); ?>"><?php esc_html_e('Order Now','restaurant-food-delivery'); ?></a>
              <?php endif; ?>
            </p>
          </div>
        </div>
      <?php
    endwhile;
    wp_reset_postdata();
    endif; ?>
  </div>
</div>

<?php endif; ?>