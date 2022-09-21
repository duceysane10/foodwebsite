<?php
namespace Depicter\DataSources;

use Averta\Core\Utility\Data;

class HandPickedProducts extends Products {

    /**
	 * Source name
	 *
	 * @var string
	 */
	protected $type = 'wooHandpicks';

    /**
	 * Input params to filter source result
	 *
	 * @var array
	 */
	protected $params = [
		'postType' => 'product',
		'excerptLength' => 100,
		'linkSlides' => true,
		'orderBy' => 'post__in',
		'order' => 'DESC',
		'imageSource' => 'featured',
		'includedIds' => '',
		'excludeNonThumbnail' => true,
        'inStockOnly' => true,
	];

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
		    'order'           => $args['order'],
		    'orderby'         => $args['orderBy'],
		    'post__in'        => $args['includedIds'],
		    'tax_query'       => [],
			'meta_query'      => []
	    ];

		if( Data::isTrue( $args['excludeNonThumbnail'] ) ){
			$queryArgs['meta_query'][] = [
	    		'key'     => '_thumbnail_id',
                'compare' => 'EXISTS'
		    ];
		}

	    if ( !empty( $args['excerptLength'] ) ) {
	    	add_filter( 'excerpt_length', function () use ($args) {
	    		return $args['excerptLength'];
		    });
	    }

        if ( Data::isTrue( $args['inStockOnly'] ) ) {
            $queryArgs['meta_query'][] = [
                'key' => '_stock_status',
                'value' => 'instock',
                'compare' => '=',
            ];
        }

		return new \WP_Query( $queryArgs );
	}
}
