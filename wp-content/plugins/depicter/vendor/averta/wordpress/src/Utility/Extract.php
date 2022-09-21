<?php
namespace Averta\WordPress\Utility;


class Extract
{
	/**
	 * Extract all images from content
	 *
	 * @param string $text The text to extract images from.
	 *
	 * @return bool|array  List of images in array
	 */
	public static function imagesFromText( $text )
	{
		preg_match_all( '|<img.*?src=[\'"](.*?)[\'"].*?>|i', $text, $matches );
		return isset( $matches ) && count( $matches[0] ) ? $matches : false;
	}

	/**
	 * Get first image src from content
	 *
	 * @param  string $text   The content to extract image from.
	 *
	 * @return string         First image URL on success and empty string if nothing found
	 */
	public static function firstImageSrcFromText( $text )
	{
		$images = self::imagesFromText( $text );

    	return ( $images && count( $images[1]) ) ? $images[1][0] : '';
	}

	/**
	 * Get first image tag from string
	 *
	 * @param  string $text  The text to extract image from.
	 *
	 * @return string        First image tag on success and empty string if nothing found
	 */
	public static function firstImageFromText( $text )
	{
		$images = self::imagesFromText( $text );

    	return ( $images && count( $images[0]) ) ? $images[0][0] : '';
	}
}
