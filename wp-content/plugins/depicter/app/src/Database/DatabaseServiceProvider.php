<?php

namespace Depicter\Database;

use Depicter\Database\Repository\DocumentRepository;
use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Load document data manager.
 */
class DatabaseServiceProvider implements ServiceProviderInterface {

	/**
	 * {@inheritDoc}
	 */
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$container[ 'depicter.database.migration' ] = function () {
			return new Migration();
		};

		$container[ 'depicter.database.repository.document' ] = function () {
			return new DocumentRepository();
		};

		$app = $container[ WPEMERGE_APPLICATION_KEY ];
		$app->alias( 'documentRepository', 'depicter.database.repository.document' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		register_activation_hook( DEPICTER_PLUGIN_FILE, [ $this, 'activate' ] );
	}

	/**
	 * Plugin activation.
	 *
	 * @return void
	 */
	public function activate() {
		\Depicter::resolve( 'depicter.database.migration' )->migrate(true);
	}

}
