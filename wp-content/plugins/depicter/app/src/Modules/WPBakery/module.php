<?php

namespace Depicter\Modules\WPBakery;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module {

    /**
     * Class constructor
     */
    public function __construct() {
        if ( function_exists( 'vc_map' ) ) {
            $this->map_vc_shortcodes();
        }
    }

    /**
     * Add depicter shortcode to wpbakery
     *
     * @return void
     */
    public function map_vc_shortcodes() {

        vc_map([
            'name' => __( 'Depicter', 'depicter' ),
            'base' => 'depicter',
            'category' => __( 'Content', 'depicter' ),
            'description' => __( 'Make animated and interactive slider', 'depicter' ),
            'icon'  => \Depicter::core()->assets()->getUrl() . '/resources/images/svg/logo-without-text.svg',
            'params' => [
                [
                    'type'        => 'dropdown',
                    'class'       => '',
                    'admin_label' => true,
                    'heading'     => __( 'Select Slider', 'depicter' ),
                    'param_name'  => 'id',
                    'value'       => $this->get_sliders_list(),
                ]
            ]
        ]);
    }

	/**
	 * get sliders list
	 *
	 * @return array
	 * @throws \Exception
	 */
    public function get_sliders_list() {
        if ( ! isset( $_POST['action'] ) || $_POST['action'] != 'vc_edit_form' ) {
            return [];
        }

		$list = [
			__( 'Select Slider', 'depicter' ) => 0
		];
		$documents = \Depicter::documentRepository()->getList();
		foreach( $documents as $document ) {
            $list[ "[#{$document['id']}]: " . $document['name'] ] = $document['id'];
		}
		return $list;
	}
}

new Module();
