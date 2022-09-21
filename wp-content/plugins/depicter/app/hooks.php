<?php
/**
 * Declare any actions and filters here.
 * In most cases you should use a service provider, but in cases where you
 * just need to add an action/filter and forget about it you can add it here.
 *
 * @package Depicter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:ignore
// add_action( 'some_action', 'some_function' );
function depicter_add_thumbnail_size() {
	add_image_size( 'depicter-thumbnail', 200, 9999, false );
}
add_action( 'after_setup_theme', 'depicter_add_thumbnail_size' );


function depicter_purge_document_cache( $documentID, $properties ) {
	if ( $properties['status'] === 'publish' ) {
		\Depicter::cache('document')->delete( $documentID );
	}
}
add_action( 'depicter/editor/after/store', 'depicter_purge_document_cache', 10, 2 );


/**
 * Depicter sanitize html tags for depicter slider output
 *
 * @param array $allowed_tags
 * @return void
 */
function depicter_sanitize_html_tags_for_output( $allowed_tags ) {
	return array_merge( $allowed_tags, wp_kses_allowed_html( 'post' ) );
}
add_filter( 'averta/wordpress/sanitize/html/tags/depicter/output', 'depicter_sanitize_html_tags_for_output' );


function depicter_disable_nocache_headers( $headers ) {
	unset( $headers['Expires'] );
	unset( $headers['Cache-Control'] );
	return $headers;
}


/**
 * Set Svg Meta Data
 *
 * Adds dimensions metadata to uploaded SVG files, since WordPress doesn't do it.
 *
 * @param array $data
 * @param int $id
 * @return array $data
 */
function depicter_set_svg_meta_data( $data, $id ) {
	// If the attachment is an svg
	if ( 'image/svg+xml' === get_post_mime_type( $id ) ) {
		// If the svg metadata are empty or the width is empty or the height is empty.
		// then get the attributes from xml.
		if ( empty( $data ) || empty( $data['width'] ) || empty( $data['height'] ) ) {
			$attachment = get_the_guid( $id );
			$xml = simplexml_load_file( $attachment );

			if ( ! empty( $xml ) ) {
				$attr = $xml->attributes();
				$view_box = explode( ' ', $attr->viewBox );// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				$data['width'] = isset( $attr->width ) && preg_match( '/\d+/', $attr->width, $value ) ? (int) $value[0] : ( 4 === count( $view_box ) ? (int) $view_box[2] : null );
				$data['height'] = isset( $attr->height ) && preg_match( '/\d+/', $attr->height, $value ) ? (int) $value[0] : ( 4 === count( $view_box ) ? (int) $view_box[3] : null );
			}
		}
	}

	return $data;
}
add_filter( 'wp_update_attachment_metadata', 'depicter_set_svg_meta_data', 10, 2 );

function depicter_clear_cache_by_cache_enabler() {
	$cacheEnabled =  !empty( $_GET['_cache'] ) && $_GET['_cache'] == 'cache-enabler' ? true : false;
	$isClearAction = !empty( $_GET['_action'] ) && ( $_GET['_action'] == 'clear' || $_GET['_action'] == 'clearurl' );
	if ( $cacheEnabled && $isClearAction && !empty( $_GET['_wpnonce'] ) && wp_verify_nonce( $_GET['_wpnonce'], 'cache_enabler_clear_cache_nonce' ) ) {
		$documents = \Depicter::documentRepository()->getList();
		if ( !empty( $documents ) ) {
			foreach( $documents as $document ) {
				\Depicter::cache('document')->delete( $document['id'] );
			}
		}
	}
}
add_action( 'init', 'depicter_clear_cache_by_cache_enabler' );
