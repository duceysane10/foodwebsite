<?php
namespace Depicter\Document\Models\Common;


use Depicter\Document\CSS\Breakpoints;
use Depicter\Document\CSS\Selector;
use Depicter\Document\Models\Traits\HasDataSheetTrait;
use Depicter\Html\Html;
use Depicter\Services\MediaBridge;

class Background
{
	use HasDataSheetTrait;

	/**
	 * @var Color
	 */
	public $color;

	/**
	 * @var string
	 */
	public $fitMode;

	/**
	 * @var object
	 */
	public $video;

	/**
	 * @var object
	 */
	public $image;

	/**
	 * @var Color
	 */
	public $overlay;

	/**
	 * @var Styles\Filter
	 */
	public $filter;

	/**
	 * Check if section has background or not
	 *
	 * @return boolean
	 */
	public function hasBackground() {
		return !empty( $this->image->src ) || !empty( $this->video->src );
	}


	/**
	 * @return Html|string
	 */
	public function render() {

		$html = '';

		if ( !empty( $this->image->src ) ) {
			$originalSrc = $this->image->src;
			$this->image->src = $this->maybeReplaceDataSheetTag( $this->image->src, '{{{featuredImage}}}' );
			$html .= $this->renderImage( \Depicter::media()->getSourceUrl( $this->image->src ) );
			// restore original image src
			$this->image->src = $originalSrc;
		}

		if ( !empty( $this->video->src ) ) {
			$html .= $this->renderVideo( \Depicter::media()->getSourceUrl( $this->video->src ) );
		}

		return $html;

	}

	/**
	 * render images
	 * @param $image
	 *
	 * @return Html
	 */
	protected function renderImage( $imageUrl ) {
		$imageSrcSet = is_numeric( $this->image->src ) ? \Depicter::media()->getSrcSet( $this->image->src, 'full' ) : '';

		$args = [
			'class'         => 'depicter-bg',
			'src'			=>  \Depicter::media()::IMAGE_PLACEHOLDER_SRC,
			'data-src'      => $imageUrl,
			'alt'           => is_numeric( $this->image->src ) ? \Depicter::media()->getAltText( $this->image->src ) : ''
		];

		if ( $imageSrcSet ) {
			$args['data-srcset'] = $imageSrcSet;
		}

		$available_args = [
			'responsiveArgs' => [
				'data-object-fit'       => 'fitMode',
				'data-object-position'  => 'position'
			]
		];

		$args = $this->get_element_attributes( 'image', $args, $available_args );

		return Html::img( $imageUrl, $args);
	}

	public function renderVideo( $videoUrl ) {

		$args = [
			'class' 		=> Selector::prefixify( 'bg-video' ),
			'src'           => $videoUrl,
			'preload'       => 'metadata',
			'playsinline'   => "true"
		];

		$available_args = [
			'muted' => 'muted',
			'loop'  => 'loop',
			'data-goto-next'  => 'goNextSlide',
			'data-auto-pause' => 'pause',
			'responsiveArgs' => [
				'data-object-fit'       => 'fitMode',
				'data-object-position'  => 'position'
			]
		];

		$args = $this->get_element_attributes( 'video', $args, $available_args );

		return Html::video( $args );
	}

	public function get_element_attributes( $element_type, $args, $available_args ) {
		foreach ( $available_args as $attribute => $property ) {
			// for object properties that has responsive value like fitMode and position
			if ( $attribute == 'responsiveArgs' ) {
				foreach ( $property as $key => $value ) {
					$breakpointNames = Breakpoints::names();
					if ( !empty( $this->{$element_type}->{$value} ) ) {
						foreach ( $breakpointNames as $device ) {
							$args[ $key ][] = !empty( $this->{$element_type}->{$value}->{$device} ) ? $this->{$element_type}->{$value}->{$device} : '';
						}
						$args[ $key ] = implode(',', $args[ $key ] );
					}
				}

			// for simple object properties
			} elseif ( !empty( $this->{$element_type}->{$property} ) ) {
				$value = $this->{$element_type}->{$property} == "1" ? "true" : $this->{$element_type}->{$property};
				$args[ $attribute ] = $value;
			}

			// In video background, if each of `muted` or `loop` are not set, consider it as `true` by default
			if( $element_type === 'video' ){
				if( in_array( $property, ['muted', 'loop'] ) ){
					if( ! isset( $this->{$element_type}->{$property} ) ){
						$args[ $attribute ] = 'true';
					}
				}
			}
		}
		return $args;
	}

	/**
	 * Get css background color
	 *
	 * @return array
	 */
	public function getColor() {
		$devices = Breakpoints::names();

		$css = [];
		foreach ( $devices as $device ) {
			if ( !empty( $this->color->{$device} ) ) {
				$css[ $device]['background-color'] = $this->color->{$device};
			}
		}

		return $css;
	}

	/**
	 * Get background overlay styles
	 *
	 * @return array
	 */
	public function getOverlayStyles() {
		$default = [
			"content" => '""',
			"display" => "block",
			"position"=> "absolute",
			"top"     => "0",
			"bottom"  => "0",
			"right"   => "0",
			"left"    => "0",
			"z-index" => "1",
		];

		$devices = Breakpoints::names();

		$css = [];
		foreach ( $devices as $device ) {
			if ( !empty( $this->overlay->{$device} ) && ('transparent' !== $this->overlay->{$device} ) ) {
				$css[ $device] = $default;
				$css[ $device]['background-color'] = $this->overlay->{$device};
			}
		}

		return $css;
	}

	/**
	 * Get filter styles of background
	 *
	 * @return array|mixed
	 */
	public function getSectionBackgroundFilter() {
		if( empty( $this->filter ) ){
			return [];
		}
		return $this->filter->set([]);
	}

	/**
	 * Get class name of background container
	 *
	 * @return string
	 */
	public function getContainerClassName() {
		if ( !empty( $this->video->src ) ) {
			return Selector::prefixify('bg-video-container');
		}
		return Selector::prefixify('bg-container');
	}
}
