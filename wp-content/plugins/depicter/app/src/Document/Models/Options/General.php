<?php
namespace Depicter\Document\Models\Options;

use Depicter\Document\CSS\Breakpoints;

class General
{
	/**
	 * @var int
	 */
	public $fullscreenMargin;

	/**
	 * @var bool
	 */
	public $autoHeight;

	/**
	 * @var bool
	 */
	public $keepAspect;

	/**
	 * @var Unit
	 */
	public $minHeight;

	/**
	 * @var Unit
	 */
	public $maxHeight;

	/**
	 * @var States
	 */
	public $visible;

	/**
	 * @var string
	 */
	public $backgroundColor = '';

	/**
	 * @var All
	 */
	protected $allOptions;


	public function setAllOptions( $allOptions ){
		$this->allOptions = $allOptions;
	}

	public function getAllOptions(){
		return $this->allOptions;
	}

	public function getStylesList(){
		$styles = [
			'default' => []
		];

		// ignore min and max height if autoHeight is enabled or keep aspect ratio is disable
		if( $this->getAllOptions()->getLayout() !== 'fullscreen' && ! $this->autoHeight && $this->keepAspect ) {

			$heightSizes = $this->getAllOptions()->getSizes('height', false );
			foreach ( $heightSizes as $device => $height ){
				// always add max-height for desktop size
				// and add max-height for other breakpoints if max-height is less than breakpoint content height
				if( $device === 'default' || $this->maxHeight < $height ){
					$styles[ $device ][ 'max-height' ] = $height . 'px';
				}
				if( ! empty( $this->minHeight ) ){
					$styles[ $device ]['min-height'] = $this->minHeight;
				}
			}
		}

		if( $this->backgroundColor ){
			$styles['default']['background-color'] = $this->backgroundColor;
		}

		return $styles;
	}


	/**
	 * Get before init document styles
	 *
	 * @return array
	 */
	public function getBeforeInitStyles(){
		$styles = [
			'default' => []
		];
		$layout = $this->getAllOptions()->getLayout();

		if( $layout == 'fullscreen' ){
			if( $this->fullscreenMargin ){
				$styles['default']['height'] = "calc( 100vh - {$this->fullscreenMargin}px )";
			}
		} elseif( $layout == 'boxed' ){
			$responsiveSizes = $this->getAllOptions()->getSizes('width', true);
			foreach ( $responsiveSizes as $device => $value ){
				$styles[ $device ][ 'width' ] = $value;
			}

			$responsiveSizes = $this->getAllOptions()->getSizes('height', true);
			foreach ( $responsiveSizes as $device => $value ){
				$styles[ $device ][ 'height' ] = $value;
			}
		} elseif( $layout == 'fullwidth' ){
			$responsiveSizes = $this->getAllOptions()->getSizes('height', true);
			foreach ( $responsiveSizes as $device => $value ){
				$styles[ $device ][ 'height' ] = $value;
			}
		}

		return $styles;
	}


}
