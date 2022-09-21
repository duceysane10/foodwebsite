<?php
namespace Depicter\Front;


use Averta\Core\Utility\Arr;


class Assets
{
	/**
	 * @var string
	 */
	private $baseAssetsUrl = '';


	public function bootstrap()
	{
		$this->baseAssetsUrl = \Depicter::core()->assets()->getUrl();

		add_action('wp_enqueue_scripts', [ $this, 'enqueueAssets' ]);
	}

	/**
	 * Retrieves a list of styles based on given group
	 *
	 * @param string|array  $group   A group name or list of groups in array
	 *
	 * @return array
	 */
	public function getStyles( $group = 'common' )
	{
		$assets = $this->getStylesDictionary();
		return $this->getAssetFromList( $group, $assets );
	}

	/**
	 * Retrieves a list of scripts based on given group
	 *
	 * @param string|array  $group   A group name or list of groups in array
	 *
	 * @return array
	 */
	public function getScripts( $group = 'player' )
	{
		$assets = $this->getScriptsDictionary();
		return $this->getAssetFromList( $group, $assets );
	}

	/**
	 * Enqueues required styles and scripts for a document
	 *
	 * @return void
	 */
	public function enqueueAssets(){

		if( ! apply_filters('depicter/font/enqueue/assets', true ) ){
			return;
		}

		// Enqueue scripts.
		$this->enqueueScripts('player');

		// Enqueue styles.
		$this->enqueueStyles('common');
	}

	/**
	 * Enqueues a list of styles based on given group
	 *
	 * @param string|array  $group   A group name or list of groups in array
	 *
	 * @return array
	 */
	public function enqueueStyles( $group = 'common' )
	{
		$styleUrls = $this->getStyles( $group );

		foreach ( $styleUrls as $styleId => $styleUrl ) {
			\Depicter::core()->assets()->enqueueStyle( $styleId, $styleUrl );
		}

		return $styleUrls;
	}

	/**
	 * Enqueues a list of scripts based on given group
	 *
	 * @param string|array  $group   A group name or list of groups in array
	 *
	 * @return array
	 */
	public function enqueueScripts( $group = 'player', $inFooter = true )
	{
		$scriptUrls = $this->getScripts( $group );
		foreach ( $scriptUrls as $scriptId => $scriptUrl ){
			\Depicter::core()->assets()->enqueueScript( $scriptId, $scriptUrl, [], $inFooter );
		}

		return $scriptUrls;
	}

	/**
	 * Registers a list of styles based on given group
	 *
	 * @param string|array  $group   A group name or list of groups in array
	 *
	 * @return array
	 */
	public function registerStyles( $group = 'common' )
	{
		$styleUrls = $this->getStyles( $group );

		foreach ( $styleUrls as $styleId => $styleUrl ) {
			wp_enqueue_style( $styleId, $styleUrl, [], false, false );
		}

		return $styleUrls;
	}

	/**
	 * Registers a list of scripts based on given group
	 *
	 * @param string|array  $group   A group name or list of groups in array
	 *
	 * @return array
	 */
	public function registerScripts( $group = 'player' )
	{
		$scriptUrls = $this->getScripts( $group );
		foreach ( $scriptUrls as $scriptId => $scriptUrl ){
			wp_enqueue_script( $scriptId, $scriptUrl, [], false,false );
		}

		return $scriptUrls;
	}

	/**
	 * Searches for group(s) in list of given assets and returns result in a list
	 *
	 * @param string|array $group A group name or list of groups in array
	 * @param array        $assets
	 *
	 * @return array
	 */
	protected function getAssetFromList( $group = 'common', $assets = [] )
	{
		if( empty( $group ) ){
			return $assets;
		}

		if( is_array( $group ) ){
			if( count( $group ) > 1 ){
				$result = [];
				foreach ( $group as $groupKey ){
					if( $value = Arr::searchKeyDeep( $assets, $groupKey ) ){
						if( is_string( $value ) ){
							$result[ $groupKey ] = $value;
						} else {
							$result = $result + $value;
						}
					}
				}
				return $result;
			}
		}

		$group = (string) $group;
		$result = [];

		if( $value = Arr::searchKeyDeep( $assets, $group ) ){
			if( is_string( $value ) ){
				$result = [ $group => $value ];
			} elseif( is_array( $value ) ) {
				$result = $value;
			}
		}

		return $result;
	}

	/**
	 * Full list of front styles
	 *
	 * @return array
	 */
	protected function getStylesDictionary()
	{
		$stylesDictionary = [
			'situational' => [
				'minireset' => $this->baseAssetsUrl . '/resources/styles/frontend/reset.min.css',
				'depicter-preview-style' => $this->baseAssetsUrl . '/resources/styles/player/preview.css'
			],
			'common' => [
				'depicter-front-common' => $this->baseAssetsUrl . '/resources/styles/player/depicter.css'
			]
		];

		return $stylesDictionary;
	}

	/**
	 * Full list of front scripts
	 *
	 * @return array
	 */
	protected function getScriptsDictionary()
	{
		$scriptsDictionary = [
			'player' => [
				'depicter-player' => $this->baseAssetsUrl . '/resources/scripts/player/depicter.js'
			],
			'widget' => [
				'depicter-widget' => $this->baseAssetsUrl . '/resources/scripts/widgets/elementor-widget.js'
			]
		];

		return $scriptsDictionary;
	}

}
