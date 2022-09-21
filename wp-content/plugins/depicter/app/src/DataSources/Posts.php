<?php
namespace Depicter\DataSources;

use Averta\Core\Utility\Arr;
use Averta\Core\Utility\Data;
use Averta\Core\Utility\Str;
use Averta\WordPress\Utility\JSON;


class Posts extends Base
{
	/**
	 * Source name
	 *
	 * @var string
	 */
	protected $type = 'wpPost';

	/**
	 * Input params to filter source result
	 *
	 * @var array
	 */
	protected $params = [
		'postType' => 'post',
		'perpage' => 5,
		'excerptLength' => 55,
		'offset' => 0,
		'linkSlides' => true,
		'orderBy' => 'date',
		'order' => 'DESC',
		'imageSource' => 'featured',
		'excludedIds' => '',
		'includedIds' => '',
		'excludeNonThumbnail' => false,
		'taxonomies' => '',
		'page' 		 => 1,
		's'			 => ''
	];

	/**
	 * List of valid dynamic tags for this source
	 *
	 * @var string[]
	 */
	protected $tags = [
		'{{{uuid}}}',
		'{{{linkSlides}}}',
		'{{{url}}}',

		'{{{id}}}',
		'{{{featuredImage}}}',
		'{{{featuredImageSrc}}}',
		'{{{author.name}}}',
		'{{{author.page}}}',
		'{{{title}}}',
		'{{{excerpt}}}',
		'{{{content}}}',
		'{{{date}}}',
		'{{{readMore}}}',
		'{{categoryToStr}}', // converts the array of categories to this form cat1, cat2, cat3
		'{{post_tagToStr}}'  // converts the array of tags to this form tag1, tag2, tag3
	];

	/**
	 * Prepares query arguments to get records
	 *
	 * @param array|object $args
	 *
	 * @return array
	 */
	protected function prepare( $args ){
		return Arr::merge( $args, $this->params );
	}

	/**
	 * Retrieves the list of records based on query params
	 *
	 * @param $args
	 *
	 * @return \WP_Query
	 */
	protected function getRecords( $args ){

		$queryArgs = [
		    'post_type'       => $args['postType'],
		    'posts_per_page'  => $args['perpage'],
		    'order'           => $args['order'],
		    'orderby'         => $args['orderBy'],
		    'offset'          => $args['offset'],
			'paged'           => $args['page'],
			's'           	  => $args['s'],
		    'post__in'        => $args['includedIds'],
		    'post__not_in'    => $args['excludedIds'],
		    'tax_query'       => [],
			'meta_query'      => []
	    ];

	    if ( !empty( $args['taxonomies'] ) ) {
			$taxonomies = $args['taxonomies'];

			if( JSON::isJson( $args['taxonomies'] ) ){
				$taxonomies = JSON::decode( $args['taxonomies'] );
			}

			if( !empty( $taxonomies->category ) ){
				$queryArgs['tax_query'][] = [
					'taxonomy'  => 'category',
					'field'     => 'slug',
					'terms'     => $taxonomies->category
				];
			}

			if( !empty( $taxonomies->post_tag ) ){
				$queryArgs['tax_query'][] = [
					'taxonomy'  => 'post_tag',
					'field'     => 'slug',
					'terms'     => $taxonomies->post_tag
				];
			}
	    }

		if( Data::isTrue( $args['excludeNonThumbnail'] ) ){
			$queryArgs['meta_query'][] = [
	    		'key'     => '_thumbnail_id',
                'compare' => 'EXISTS'
		    ];
		}

		return new \WP_Query( $queryArgs );
	}

	/**
	 * Renders preview for query params
	 *
	 * @param array $args
	 *
	 * @return array
	 */
    public function previewRecords( array $args = [] ) {
		$args = $this->prepare( $args );
		$availableRecords = $this->getRecords( $args );

		$records = [];

		if ( $availableRecords && $availableRecords->have_posts() ) {


			foreach( $availableRecords->posts as $post ) {
				$featuredImage = [];
				if( has_post_thumbnail( $post->ID ) ){
					$featuredImageId = get_post_thumbnail_id( $post->ID );
					$imageInfo = wp_get_attachment_image_src( $featuredImageId, 'full' );
					$featuredImage = [
						'id'     => $featuredImageId,
						'url'    => $imageInfo[0]  ?: '',
						'width'  => $imageInfo[1] ?: '',
						'height' => $imageInfo[2] ?: '',
					];
				}

				$excerpt = !empty( $args['excerptLength'] ) ? Str::trimByChars( get_the_excerpt( $post->ID ), $args['excerptLength'] ) : get_the_excerpt( $post->ID );
				$postInfo = [
					'id'        => $post->ID,
					'title'     => get_the_title( $post->ID ),
					'url'       => get_permalink( $post->ID ),
					'featuredImage' => $featuredImage,
					'date'      => get_the_date('', $post->ID ),
					'excerpt'   => $excerpt,
					'author' => [
						'name' => get_the_author_meta( 'display_name', $post->post_author ),
						'page' => get_author_posts_url( $post->post_author ),
					],
					'content'   => get_the_content(null, false, $post->ID ),
					'taxonomies'=> []
				];

				$taxonomies = get_object_taxonomies( $args['postType'], 'objects' );

				if ( !empty( $taxonomies ) ) {
					foreach( $taxonomies as $taxonomySlug => $taxonomy ) {
						$taxonomyInfo = [
							"id"    => $taxonomySlug,
							"label" => $taxonomy->label,
							"terms" => []
						];

						if ( $terms = wp_get_post_terms( $post->ID, $taxonomySlug ) ) {
							foreach( $terms as $term ) {
								$taxonomyInfo[ "terms" ][] = [
									'id' => $term->term_id,
							        'value' => $term->slug,
							        'label' => $term->name,
									'link' => get_term_link( $term->term_id )
								];
							}
						}

						$postInfo['taxonomies'][] = $taxonomyInfo;
					}
				}

				$records[] = $postInfo;
			}
		}

		return $records;
    }

	/**
	 * search records by title
	 *
	 * @param array $args
	 *
	 * @return array
	 */
    public function searchRecordsByTitle( array $args = [] ) {
		$args = $this->prepare( $args );

		add_filter( 'posts_search', [ $this, 'searchByTitleOnly' ], 500, 2 );
		$availableRecords = $this->getRecords( $args );
		remove_filter( 'posts_search', [ $this, 'searchByTitleOnly' ], 500 );

		$records = [];

		if ( $availableRecords && $availableRecords->have_posts() ) {

			foreach( $availableRecords->posts as $post ) {
				$postInfo = [
					'id'        => $post->ID,
					'title'     => get_the_title( $post->ID ),
					'url'       => get_permalink( $post->ID )
				];

				$records[] = $postInfo;
			}
		}

		return $records;
    }

	/**
	 * Get list of tags and their values for the query result
	 *
	 * @param array $args
	 *
	 * @return array
	 */
	public function getRecordsWithTags( array $args = [] ){
		$args = $this->prepare( $args );
		$availableRecords = $this->getRecords( $args );

		$records = [];
		if ( $availableRecords && $availableRecords->have_posts() ) {
			// $taxonomies = get_object_taxonomies( $args['postType'], 'objects' );

			foreach( $availableRecords->posts as $post ) {

				$excerpt = !empty( $args['excerptLength'] ) ? Str::trimByChars( get_the_excerpt( $post->ID ), $args['excerptLength'] ) : get_the_excerpt( $post->ID );

				$thumbnailId = get_post_thumbnail_id( $post->ID );
				$featuredImageInfo = wp_get_attachment_image_src( $thumbnailId, 'full' );

				$postInfo = [
					'{{{uuid}}}' => $post->ID,
					'{{{linkSlides}}}' => !! $args['linkSlides'],
					'{{{url}}}' => get_permalink( $post->ID ),

					'{{{id}}}' => $post->ID,
					'{{{title}}}' => get_the_title( $post->ID ),
					'{{{featuredImageSrc}}}' => ! empty( $featuredImageInfo[0] ) ? $featuredImageInfo[0] : '',
					'{{{featuredImage}}}'    => ! empty( $thumbnailId ) ? $thumbnailId : '',
					'{{{date}}}' => get_the_date('', $post->ID ),
					'{{{excerpt}}}' => $excerpt,
					'{{{author.name}}}' => get_the_author_meta( 'display_name', $post->post_author ),
					'{{{author.page}}}' => get_author_posts_url( $post->post_author ),
					'{{{content}}}' => get_the_content(null, false, $post->ID ),
					'{{categoryToStr}}' => 	$this->getTaxonomyTermsStr( $post->ID, 'category' ),
					'{{post_tagToStr}}' => $this->getTaxonomyTermsStr( $post->ID, 'post_tag' ),
				];

				$records[] = $postInfo;
			}
		}

		return $records;
	}

	/**
	 * Get All Post Types info
	 *
	 * @param string $postType
	 *
	 * @return array
	 */
    public function getTypes( string $postType = 'all' ) {
    	if ( $postType == 'all' ) {
		    $availablePostType = array(
			    'post' => get_post_type_object('post'),
			    'page' => get_post_type_object('page')
		    );
		    $postTypes = get_post_types(
			    array(
				    'public'    => true,
				    '_builtin'  => false
			    ),
			    'objects'
		    );

		    $postTypes = array_merge( $availablePostType, $postTypes );
	    } else {
		    if ( !post_type_exists( $postType ) ) {
			    return [];
		    }
    		$postTypes = [ $postType => get_post_type_object( $postType ) ];
	    }

        $result = [];
        foreach( $postTypes as $id => $providedPostType ) {

	        $postTypeInfo = [
		        'id' => $id,
		        'label' => $providedPostType->label,
		        'taxonomies' => []
	        ];

	        $taxonomies = get_object_taxonomies( $id, 'objects' );

			foreach( $taxonomies as $taxonomySlug => $taxonomy ) {
				$taxonomyInfo = [
					"id"    => $taxonomySlug,
					"label" => $taxonomy->label,
					"terms" => []
				];

				$terms = get_terms([
	        		'taxonomy' => $taxonomySlug,
			        'hide_empty' => false
		        ]);

	        	if ( !empty( $terms ) ) {
	        		foreach( $terms as $term ) {
	        			$taxonomyInfo[ "terms" ][] = [
	        				'id' => $term->term_id,
					        'value' => $term->slug,
					        'label' => $term->name
				        ];
			        }
		        }

				$postTypeInfo["taxonomies"][] = $taxonomyInfo;
	        }

	        $result[] = $postTypeInfo;
        }

        return $result;
    }

	/**
	 * Get taxonomy terms string
	 *
	 * @param int $postID
	 * @param string $taxonomy
	 * @return string
	 */
	protected function getTaxonomyTermsStr( $postID, $taxonomy ) {
		$terms = get_the_terms( $postID, $taxonomy );
		if ( !empty( $terms ) ) {
			return join( ', ', wp_list_pluck($terms, 'name') );
		}

		return '';
	}

	/**
	 * Search by title in wp query
	 *
	 * @param string $search
	 * @param object $wp_query
	 * @return string $search
	 */
	public function searchByTitleOnly( $search, $wp_query ) {
		global $wpdb;
		if ( empty( $search ) ) {
			return $search;
		}

		$queryVars = $wp_query->query_vars;
		$n = !empty($queryVars['exact']) ? '' : '%';
		$search = '';
		$searchAnd = '';
		foreach ( (array) $queryVars['search_terms'] as $term ) {
			$term = esc_sql( $wpdb->esc_like( $term ) );
			$search .= " {$searchAnd} ( $wpdb->posts.post_title LIKE '{$n}{$term}{$n}' )";
			$searchAnd = ' AND ';
		}
		if ( !empty( $search ) ) {
			$search = " AND ( {$search} ) ";
			if ( !is_user_logged_in() ) {
				$search .= " AND ($wpdb->posts.post_password = '') ";
			}
		}
		return $search;
	}

}
