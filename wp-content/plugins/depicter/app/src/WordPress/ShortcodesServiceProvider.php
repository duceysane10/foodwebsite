<?php
namespace Depicter\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register shortcodes.
 */
class ShortcodesServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		add_shortcode('depicter'   , [ $this, 'process_shortcode' ]);
	}

	/**
	 * Shortcode callback
	 *
	 * @param array  $attrs
	 * @param null   $content
	 *
	 * @return string
	 * @throws \Exception
	 */
	function process_shortcode( $attrs, $content = null ) {

		extract( shortcode_atts([
			'id'    => '',
			'alias' => '',
			'slug'  => ''
		],
			$attrs,
			'depicter'
		));

		$documentId = $id;

		if ( empty( $documentId ) ) {
			if( empty( $slug ) && ! empty( $alias ) ){
				$slug = $alias;
			}
			$documentId = $slug;
		}

		return \Depicter::front()->render()->document( $documentId, [ 'echo' => false ] );
	}
}
