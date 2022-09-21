<?php
namespace Depicter\Document\Models\Elements;

use Averta\Core\Utility\Arr;
use Averta\Core\Utility\Embed;
use Depicter\Document\Models;
use Depicter\Html\Html;

class EmbedVideo extends Models\Element
{

	public function render() {

//		if ( empty( $this->options->source ) || false == $videoSrc = wp_get_attachment_url( $this->options->source ) ) {
//			return '';
//		}

		$videoUrl = !empty( $this->options->source ) ? $this->options->source : '';

		$videoAttrs = [
			'data-type' => 'video'
		];

		if( isset( $this->options->autoPlay ) ){
			$videoAttrs['data-autoplay'] = $this->options->autoPlay ? "true" : "false";
		}
		if( isset( $this->options->autoPause ) ){
			$videoAttrs['data-auto-pause'] = $this->options->autoPause ? "true" : "false";
		}
		if( isset( $this->options->mute ) ){
			$videoAttrs['data-muted'] = $this->options->mute ? "true" : "false";
		}

		$args = Arr::merge( $this->getDefaultAttributes(), $videoAttrs );

		$div = Html::div( $args );

		$video = "\n" . $this->getEmbedVideo( $videoUrl ) . "\n";

		return $div->nest( $video ) . "\n";
	}


	protected function getEmbedVideo( $videoUrl ){

		$videoType = !empty( $this->options->type ) ? $this->options->type : '';

		if( $videoType == 'youtube' ){
			return $this->getYouTubeEmbed( $videoUrl );
		} elseif( $videoType == 'vimeo' ){
			return $this->getVimeoEmbed( $videoUrl );
		}

		return '';
	}

	protected function getYouTubeEmbed( $videoUrl ){
		$embed = '';

		if( $embedUrl = Embed::getYouTubeEmbedUrl( $videoUrl ) ){
			$queryParams = [];
			if( isset( $this->options->autoPlay ) ){
				$queryParams['autoplay'] = (int) $this->options->autoPlay;
			}
			if( isset( $this->options->autoPause ) ){
				$queryParams['autopause'] = (int) $this->options->autoPause;
			}
			if( isset( $this->options->controls ) ){
				$queryParams['controls'] = (int) $this->options->controls;
			}
			if( isset( $this->options->mute ) ){
				$queryParams['mute'] = (int) $this->options->mute;
			}
			if( isset( $this->options->related ) ){
				$queryParams['rel'] = $this->options->related;
			}

			$iframeAttrs = [
				'src'             =>  add_query_arg( $queryParams, $embedUrl ),
				'frameborder' 	  => '0',
				'allow'           => 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
				'allowfullscreen' => ''
			];

			$embed = Html::iframe( $iframeAttrs );
		}

		return $embed;
	}

	protected function getVimeoEmbed( $videoUrl ){
		$embed = '';

		if( $embedUrl = Embed::getVimeoEmbedUrl( $videoUrl ) ){

			$queryParams = [];

			if( isset( $this->options->autoPlay ) ){
				$queryParams['autoplay'] = (int) $this->options->autoPlay;
			}
			if( isset( $this->options->autoPause ) ){
				$queryParams['autopause'] = (int) $this->options->autoPause;
			}
			if( isset( $this->options->controls ) ){
				$queryParams['controls'] = (int) $this->options->controls;
			}
			if( isset( $this->options->mute ) ){
				$queryParams['muted'] = (int) $this->options->mute;
			}
			if( isset( $this->options->related ) ){
				$queryParams['byline'] = (int) $this->options->related;
			}

			$iframeAttrs = [
				'src'             		=>  add_query_arg( $queryParams, $embedUrl ),
				'frameborder' 	  		=> '0',
				'allowfullscreen' 		=> '',
				'webkitallowfullscreen' => '',
				'mozallowfullscreen' 	=> ''
			];

			$embed = Html::iframe( $iframeAttrs );
		}

		return $embed;
	}
}


