<?php
namespace Depicter\DataSources;

/**
 * Chained api to access all data sources
 */
class Manager {

	/**
	 * Returns the instance of posts class
	 *
	 * @return Posts
	 */
	public function posts()
	{
		return \Depicter::resolve('depicter.dataSources.posts');
	}

	/**
	 * Returns the instance of products class
	 *
	 * @return Products
	 */
	public function products()
	{
		return \Depicter::resolve('depicter.dataSources.products');
	}

	/**
	 * Returns the instance of hand picked products class
	 *
	 * @return HandPickedProducts
	 */
	public function handPickedProducts()
	{
		return \Depicter::resolve('depicter.dataSources.handPickedProducts');
	}

	/**
	 * @param string $type
	 *
	 * @return Posts|Products|HandPickedProducts|bool
	 */
	public function getByType( $type ){
		if( 'wpPost' === $type || 'wpPage' === $type ){
			return $this->posts();
		}

		if( 'wooProducts' === $type  ){
			return $this->products();
		}

		if( 'wooHandpicks' === $type  ){
			return $this->handPickedProducts();
		}

		return false;
	}

}
