<?php

namespace Depicter\Media;


class Uri
{
	/**
	 * Convert path to url
	 *
	 * @param string $file  File path
	 *
	 * @return string
	 */
	public static function toUrl( $file ) {
		$siteUrl = trailingslashit( get_site_url() );
		return str_replace(ABSPATH, $siteUrl, $file );
	}
}
