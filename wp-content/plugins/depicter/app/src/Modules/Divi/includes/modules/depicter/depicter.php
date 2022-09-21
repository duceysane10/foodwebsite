<?php

class Divi_Depicter_Module extends ET_Builder_Module {

	public $slug       = 'depicter_module';

	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'Depicter',
		'author'     => 'averta',
		'author_uri' => '',
	);

	public function init() {

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_depicter_assets' ] );

		$this->name = esc_html__( 'Depicter', 'depicter' );
	}

	public function enqueue_depicter_assets() {
		global $post;
		if ( et_core_is_fb_enabled() ) {
			wp_localize_script( 'divi-depicter-builder-bundle', 'depicter_divi', [
				'ajax_url' => admin_url('admin-ajax.php'),
				'token' => \Depicter::csrf()->getToken( \Depicter\Security\CSRF::EDITOR_ACTION ),
			]);
		}

		if ( et_core_is_builder_used_on_current_request() ) {
			if ( strpos( $post->post_content, $this->slug ) || et_core_is_fb_enabled() ) {
				\Depicter::front()->assets()->enqueueStyles();
				\Depicter::front()->assets()->enqueueScripts();

				preg_match_all( '/document_id="(\d+)"/', $post->post_content, $sliderIDs, PREG_SET_ORDER );
				foreach( $sliderIDs as $key => $sliderID ) {
					if ( !empty( $sliderID[1] ) ) {
						if ( \Depicter::authorization()->currentUserCan( [ 'manage_options', 'publish_depicter' ] ) ) {
							\Depicter::front()->assets()->enqueueCustomGoogleFonts( $sliderID[1] );
						} else {
							\Depicter::front()->assets()->enqueueCustomStyles( $sliderID[1] );
						}
					}
				}
			}
		}

	}

	public function getSlidersList() {
		$list = [
			0 => __( 'Select Slider', 'depicter' )
		];
		$documents = \Depicter::documentRepository()->getList();
		foreach( $documents as $document ) {
			$list[ $document['id'] ] = "[#{$document['id']}]: " . $document['name'];
		}
		return $list;
	}

	public function get_fields() {
		return array(
			'document_id'                     => array(
				'label'            => et_builder_i18n( 'Slider ID' ),
				'type'             => 'select',
				'options'          => $this->getSlidersList(),
			),
		);
	}

	public function render( $attrs, $content = null, $render_slug ) {
		$args = [
			'addImportant' => true,
		];
		
		return \Depicter::front()->render()->document( $this->props['document_id'], $args );
	}
}

new Divi_Depicter_Module;
