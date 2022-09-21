<?php
namespace Depicter\DataSources;

abstract class Base
{
	/**
	 * Source name
	 *
	 * @var string
	 */
	protected $type;

	/**
	 * Input params to filter source result
	 *
	 * @var array
	 */
	protected $params;

	/**
	 * List of valid dynamic tags for this source
	 *
	 * @var string[]
	 */
	protected $tags;

	/**
	 * Prepares query arguments to get records
	 *
	 * @param array|object $args
	 *
	 * @return array
	 */
	abstract protected function prepare( $args );

	/**
	 * Renders preview for query params
	 *
	 * @param array $args
	 *
	 * @return array
	 */
    abstract public function previewRecords( array $args = [] );

	/**
	 * Get list of tags and their values for the query result
	 *
	 * @param array $args
	 *
	 * @return array
	 */
	abstract public function getRecordsWithTags( array $args = [] );

}
