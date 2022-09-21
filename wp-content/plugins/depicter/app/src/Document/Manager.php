<?php
namespace Depicter\Document;


use Averta\WordPress\Utility\JSON;
use Depicter\Database\Repository\DocumentRepository;
use Depicter\Document\Models\Document;
use Depicter\Exception\DocumentNoContentException;
use Depicter\Exception\EntityException;
use Depicter\Front\Preview;

class Manager
{

	public function bootstrap()
	{
	}

	/**
	 * Returns the instance of preview class
	 *
	 * @return Preview
	 */
	public function preview()
	{
		return \Depicter::resolve('depicter.front.document.preview');
	}

	/**
	 * Returns the instance of documentRepository class
	 *
	 * @return DocumentRepository
	 */
	public function repository()
	{
		return \Depicter::resolve('depicter.database.repository.document');
	}

	/**
	 * Retrieves object of document editor data
	 *
	 * @param       $documentId
	 * @param array $where
	 *
	 * @return bool|mixed
	 * @throws EntityException
	 */
	public function getEditorData( $documentId, $where = [] ){
		if( ! $documentEditorJson = $this->repository()->geContent( $documentId, $where ) ){
			throw new DocumentNoContentException( 'No content yet.', 0, $where );
		}
		$data =  JSON::decode( $documentEditorJson, false );
		unset( $data->computedValues );
		return $data;
	}

	/**
	 * Retrieves json of document editor data
	 *
	 * @param       $documentId
	 * @param array $where
	 *
	 * @return bool|mixed
	 */
	public function getEditorRawData( $documentId, $where = [] ){
		try{
			if( ! $documentEditorJson = $this->repository()->geContent( $documentId, $where ) ){
				return '';
			}
		} catch( \Exception $e ){
			return '';
		}
		return $documentEditorJson;
	}

	/**
	 * Get a document model by ID
	 *
	 * @param       $documentId
	 * @param array $where
	 *
	 * @return bool|Document
	 * @throws EntityException
	 * @throws \JsonMapper_Exception
	 */
	public function getModel( $documentId, $where = [] ){
		$startSection = 0;

		if( array_key_exists( 'start', $where ) ){
			$startSection = (int) $where['start'];
			unset( $where['start'] );
		}

		if ( ! $editorDataArray = $this->getEditorData( $documentId, $where ) ) {
			return false;
		}

		$editorDataArray->startSection = $startSection;

		$mapper = new Mapper();
		return $mapper->hydrate( $editorDataArray, $documentId )->get();
	}

	/**
	 * Retrieves custom css file of a document if exists
	 *
	 * @param int   $documentId
	 * @param array $where
	 *
	 * @return bool|string
	 */
	public function getCssFileUrl( $documentId, $where = [] ){
		try{
			if( $document = $this->getModel( $documentId, $where = [] ) ){
				if( $cssFile = $document->styleGenerator()->getCssFileUrl() ){
					return $cssFile;
				}
			}
		} catch( \Exception $e ){}

		return false;
	}


}
