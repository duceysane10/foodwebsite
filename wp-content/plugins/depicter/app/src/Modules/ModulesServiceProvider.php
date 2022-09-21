<?php

namespace Depicter\Modules;
;
use Depicter\Modules\Elementor\SliderWidget;
use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register widgets.
 */
class ModulesServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		add_action( 'plugins_loaded', [ $this, 'elementorModulesLoaded' ] );
		$this->modulesLoaded();
	}

	public function elementorModulesLoaded() {
		if( defined( 'ELEMENTOR_VERSION' ) ){
			New Elementor\Module();
		}
	}

	public function modulesLoaded(){

		add_action( 'init', [ $this, 'initGutenbergBlock'] );
		add_action( 'admin_enqueue_scripts', [ $this, 'loadGutenbergWidgetScripts'] );

		add_action( 'init', [ $this, 'initBeaverModule' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'load_beaver_builder_widget_script'] );

		add_action( 'vc_before_init', [ $this, 'initWPBakeryModule' ] );
		add_action( 'init', [ $this, 'initDiviModule' ] );
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {

	}

	public function load_beaver_builder_widget_script() {
		if ( class_exists( '\FLBuilderModel' ) && \FLBuilderModel::is_builder_active() ) {
			$this->enqueueEditorScripts();
        }
	}

	public function enqueueEditorScripts() {

		\Depicter::core()->assets()->enqueueStyle(
			'depicter-admin',
			\Depicter::core()->assets()->getUrl() . '/resources/styles/admin/admin.css'
		);

		\Depicter::core()->assets()->enqueueScript(
			'depicter-admin',
			\Depicter::core()->assets()->getUrl() . '/resources/scripts/admin/index.js',
			['jquery'],
			true
		);

		wp_localize_script( 'depicter-admin', 'depicterParams',[
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'editorUrl' => \Depicter::editor()->getEditUrl('1'),
			'token' => \Depicter::csrf()->getToken( \Depicter\Security\CSRF::EDITOR_ACTION ),
			'publishedText' => esc_html__( 'Published', 'depicter' )
		]);
	}

	public function loadGutenbergWidgetScripts() {

		$current_screen = get_current_screen();
		if ( !$current_screen->is_block_editor() ) {
			return;
		}

		$list = [
			[
				'id' => "0",
				'name' => __( 'Select Slider', 'depicter' )
			]
		];
		$list = array_merge( $list, \Depicter::app()->documentRepository()->getList(['name','id']) );
		if ( !empty( $list ) ) {
			foreach ( $list as $key => $item ) {
				$list[ $key ]['label'] = $item['name'];
				unset( $list[ $key ]['name'] );

				$list[ $key ]['value'] = $item['id'];
				unset( $list[ $key ]['id'] );
			}
		}
		wp_localize_script( 'wp-block-editor', 'depicterSliders',[
			'list' => $list
		]);

	}

	public function initGutenbergBlock() {
		register_block_type( __DIR__ . '/Gutenberg/build', [
			'render_callback' => [ $this, 'renderGutenbergBlock' ]
		] );
	}

	public function renderGutenbergBlock( $blockAttributes ) {

		if ( !empty( $blockAttributes['id'] ) ) {
			$id = (int) $blockAttributes['id'];
			return depicter( $id, ['echo' => false ] );
		} else {
			echo esc_html__( 'Slider ID required', 'depicter' );
		}

	}


	/**
	 * Load beaver builder module
	 *
	 * @return void
	 */
	public function initBeaverModule() {
		if ( class_exists( '\FLBuilder' ) ) {
			require_once 'Beaver/module.php';
		}
	}

	/**
	 * Load WPBakery module
	 *
	 * @return void
	 */
	public function initWPBakeryModule() {
		require_once 'WPBakery/module.php';
	}

	/**
	 * Load divi module
	 *
	 * @return void
	 */
	public function initDiviModule() {
		if ( class_exists( 'ET_Builder_Plugin' ) ) {
			require_once 'Divi/depicter-divi.php';
		}
	}
}
