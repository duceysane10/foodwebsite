<?php
namespace Depicter\DataSources;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

class ServiceProvider implements ServiceProviderInterface
{
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$app = $container[ WPEMERGE_APPLICATION_KEY ];

		// register dataSource manager
		$container[ 'depicter.dataSources.dataSource' ] = function () {
			return new Manager();
		};
		$app->alias( 'dataSource', 'depicter.dataSources.dataSource' );

		// register posts dataSource
		$container[ 'depicter.dataSources.posts' ] = function () {
			return new Posts();
		};

		// register products dataSource
		$container[ 'depicter.dataSources.products' ] = function () {
			return new Products();
		};

		// register hand picked products dataSource
		$container[ 'depicter.dataSources.handPickedProducts' ] = function () {
			return new HandPickedProducts();
		};
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {}
}
