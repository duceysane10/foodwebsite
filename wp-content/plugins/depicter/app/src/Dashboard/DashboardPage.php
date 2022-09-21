<?php
namespace Depicter\Dashboard;

use Averta\Core\Utility\Arr;
use Averta\WordPress\Utility\Escape;
use Averta\WordPress\Utility\Plugin;
use Depicter\Security\CSRF;

class DashboardPage
{

	const HOOK_SUFFIX = 'toplevel_page_depicter-dashboard';

	/**
	 * @var string
	 */
	var $hook_suffix = '';

	public function bootstrap(){
		add_action( 'admin_menu', [ $this, 'registerPage' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueueScripts' ] );
		add_action( 'admin_head', array( $this, 'disable_admin_notices' ) );
	}

	/**
	 * Register admin pages.
	 *
	 * @return void
	 */
	public function registerPage() {
		$this->hook_suffix = add_menu_page(
			__('Depicter', 'depicter'),
			__('Depicter', 'depicter'),
			'manage_options',
			'depicter-dashboard',
			[ $this, 'render' ], // called to output the content for this page
			\Depicter::core()->assets()->getUrl() . '/resources/images/svg/wp-logo.svg'
		);

		add_action( 'admin_print_scripts-' . $this->hook_suffix, [ $this, 'printScripts' ] );
	}

	/**
	 * Disable all admin notices in dashboard page
	 *
	 * @return void
	 */
	public function disable_admin_notices() {
		$screen = get_current_screen();
		if ( $screen->id == $this->hook_suffix ) {
			remove_all_actions( 'admin_notices' );
		}
	}

	public function render(){
		echo Escape::content( \Depicter::view( 'admin/dashboard/index.php' )->toString() );
	}

	/**
	 * Load dashboard scripts
	 *
	 * @param string $hook_suffix
	 */
	public function enqueueScripts( $hook_suffix = '' ){

		if( $hook_suffix !== $this->hook_suffix ){
			return;
		}

		// Enqueue scripts.
		\Depicter::core()->assets()->enqueueScript(
			'depicter-dashboard-js',
			\Depicter::core()->assets()->getUrl() . '/resources/scripts/dashboard/depicter-dashboard.js',
			[],
			true
		);

		// Enqueue styles.
		\Depicter::core()->assets()->enqueueStyle(
			'depicter-dashboard-css',
			\Depicter::core()->assets()->getUrl() . '/resources/styles/dashboard/index.css'
		);
	}

	/**
	 * Print required scripts in Dashboard page
	 *
	 * @return void
	 */
	public function printScripts()
	{
		global $wp_version;
		$currentUser = wp_get_current_user();

		wp_localize_script('depicter-dashboard-js', 'depicterDashboardEnv',
		    Arr::merge( $this->getCommonEnvParams(), [
				"assetsAPI"   => Escape::url('https://wp-api.depicter.com/' ),
				"wpRestApi"   => Escape::url( get_rest_url() ),
				"dashboardAPI"  => admin_url( 'admin-ajax.php' ),
				"editorPath"  => \Depicter::editor()->getEditUrl( '__id__' ),
				"documentPreviewPath" => \Depicter::editor()->getEditUrl( '__id__' ),
				'user' => [
					'subscriptionPlan' => \Depicter::options()->get('user_plan', 'free-user'),
					'name'  => Escape::html( $currentUser->display_name ),
					'email' => Escape::html( $currentUser->user_email   ),
					'hasSubscribed' => !! \Depicter::options()->get('has_subscribed')
				]
			])
		);

		wp_localize_script('depicter-dashboard-js', 'depicterKitEnv',
			Arr::merge( $this->getCommonEnvParams(), [
				'editorAPI'   => admin_url( 'admin-ajax.php' ),
				'user' => [
					'subscriptionPlan' => \Depicter::options()->get('user_plan', 'free-user')
				]
			])
		);

	}

	/**
	 * Get common ENV variables
	 *
	 * @return array
	 */
	protected function getCommonEnvParams(){
		global $wp_version;

		return [
			'wpVersion'   => $wp_version,
			"scriptsPath" => \Depicter::core()->assets()->getUrl(). '/resources/scripts/dashboard/',
			'clientKey'   => \Depicter::options()->get( 'client_key', 'anon' ),
			'csrfToken'   => \Depicter::csrf()->getToken( CSRF::DASHBOARD_ACTION ),
			'updateInfo' => [
				'from' => \Depicter::options()->get('version_previous') ?: null,
				'to'   => \Depicter::options()->get('version')
			],
			'integrations' => [
				'woocommerce' => Plugin::isActive( 'woocommerce/woocommerce.php' )
			]
		];
	}
}
