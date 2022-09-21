<?php
namespace Averta\Core\Utility;


class Embed
{
	/**
	 * Extracts and returns YouTube video code from video url
	 *
	 * @param string $videoUrl    YouTube url
	 *
	 * @return bool|mixed  Returns the YouTube video code on success, and false on failure.
	 */
	public static function getYouTubeCode( $videoUrl ){
        if ( strpos( $videoUrl, 'youtu.be' ) !== false ) {
            return pathinfo( $videoUrl, PATHINFO_FILENAME );
        }
		return Str::extractByRegex( $videoUrl, '/[\\?\\&]v=([^\\?\\&]+)/', 1 );
	}

	/**
	 * Converts YouTube url to embed url
	 *
	 * @param string $videoUrl    YouTube url
	 *
	 * @return bool|mixed  Returns the YouTube embed url on success, and false on failure.
	 */
	public static function getYouTubeEmbedUrl( $videoUrl ){
		if( $code = self::getYouTubeCode( $videoUrl ) ){
			return 'https://www.youtube.com/embed/' . $code;
		}

		return $code;
	}

	/**
	 * Extracts and returns Vimeo video code from video url
	 *
	 * @param string $videoUrl    Vimeo url
	 *
	 * @return bool|mixed  Returns the Vimeo video code on success, and false on failure.
	 */
	public static function getVimeoCode( $videoUrl ){
		return Str::extractByRegex( $videoUrl, '/vimeo\.com\/([0-9]{1,10})/', 1 );
	}

	/**
	 * Converts Vimeo url to embed url
	 *
	 * @param string $videoUrl    Vimeo url
	 *
	 * @return bool|mixed  Returns the Vimeo embed url on success, and false on failure.
	 */
	public static function getVimeoEmbedUrl( $videoUrl ){
		if( $code = self::getVimeoCode( $videoUrl ) ){
			return 'https://player.vimeo.com/video/' . $code;
		}

		return $code;
	}
}
