<?php
namespace Depicter\Modules\Beaver;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends \FLBuilderModule {

    public function __construct() {
        parent::__construct( array(

            'name' => __( 'Depicter', 'depicter' ),

            'description' => __( 'Make animated and interactive image slider, video slider, post slider and carousel which work smoothly across devices.', 'depicter' ),

            'category' => __( 'Depicter', 'depicter' ),

            'dir' => DEPICTER_PLUGIN_PATH . '/app/src/Modules/Beaver/',

            'url' => DEPICTER_PLUGIN_URL . '/app/src/Modules/Beaver/',

            // 'icon' => 'button.svg',

            'editor_export' => true, // Defaults to true and can be omitted.

            'enabled' => true, // Defaults to true and can be omitted.

            'partial_refresh' => false, // Defaults to false and can be omitted.

        ) );

        $styles = \Depicter::front()->assets()->registerStyles();
        foreach ( $styles as $handler => $style ) {
            $this->add_css( $handler );
        }

        $scripts = \Depicter::front()->assets()->registerScripts();
        foreach ( $scripts as $handler => $script ) {
            $this->add_js( $handler );
        }
    }

    public static function getDepicterFields() {
        if ( ! isset( $_GET['fl_builder'] ) ) { 
            return[];
        }
        
        $list = [
			0 => __( 'Select Slider', 'depicter' )
		];
        $documents = \Depicter::documentRepository()->getList();
        foreach( $documents as $document ) {
			$list[ $document['id'] ] = "[#{$document['id']}]: " . $document['name'];
		}
        
        $fields = [
            'document_id'   => [
                'type'          => 'select',
                'label'         => __( 'Select Slider', 'depicter' ),
                'default'       => '0',
                'options'       => $list
            ]
        ];
        foreach( $documents as $document ) {

            $args = [
                'isNotPublished' => \Depicter::documentRepository()->isNotPublished( $document['id'], [ 'status' => 'publish' ] ),
                'documentStatus' => $document['status']
            ];
			
			$markup = \Depicter::view('admin/notices/builders-draft-notice')->with('view_args', $args)->toString();
            $fields[ 'slider_control_buttons_' . $document['id'] ] =  [
                'type'    => 'raw',
                'content' => $markup,
            ];
        }

        return $fields;
    }
}

\FLBuilder::register_module( '\Depicter\Modules\Beaver\Module', array(
    'general'       => array( // Tab
        'title'         => __('General', 'depicter'), // Tab title
        'sections'      => array( // Tab Sections
            'general'       => array( // Section
                'title'         => __('Depicter Settings', 'depicter'), // Section Title
                'fields'        => Module::getDepicterFields() // Section Fields
            ),
        ),
    )
) );
