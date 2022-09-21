<?php
namespace Depicter\Document;


use Depicter\Document\Models\Common\Styles\Base as Style;
use Depicter\Document\Models\Document;
use TypeRocket\Utility\Data;

/**
 * Maps JSON document data to document object
 *
 * @package Depicter\Document
 */
class Mapper
{
	/**
	 * @var Document
	 */
	protected $document;

	/**
	 * Hydrate the class with the provided $data.
	 *
	 * @param array|object $data
	 *
	 * @param int          $documentId
	 *
	 * @return mixed Mapped object is returned.
	 * @throws \JsonMapper_Exception
	 */
	public function hydrate( $data, $documentId = 0 )
	{
		// Maybe convert to object
		$dataObject = Data::cast( $data, 'object');

		// Hydrate the data to Document class
		$mapper = new \JsonMapper();
		$mapper->undefinedPropertyHandler = function( $class, $propName, $jsonValue ){
			if( $class instanceof Style ){
				$class->{$propName} = $jsonValue;
			}
		};
		$documentObject = isset( $dataObject->document ) ? $dataObject->document : $dataObject;
		$this->document = $mapper->map( $documentObject, new Document() );

		if( $documentId ){
			$this->document->setDocumentID( $documentId );
		}

		return $this;
	}

	/**
	 * Retrieves the mapped Document object
	 *
	 * @return Document
	 */
	public function get()
	{
		return $this->document;
	}

	/**
	 * @return string
	 */
	public function render()
	{
		return $this->get()->render();
	}
}
