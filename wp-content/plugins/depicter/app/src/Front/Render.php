<?php
namespace Depicter\Front;


use Averta\Core\Utility\Arr;
use Averta\WordPress\Models\WPOptions;
use Depicter\Exception\DocumentNotPublished;
use Depicter\Utility\Sanitize;

class Render
{
	/**
	 * @var WPOptions
	 */
	private $cache;

	public function __construct(){
		$this->cache = \Depicter::cache('document');
	}

	/**
	 * Retrieves or renders a document markup
	 *
	 * @param int|string   $documentID  Document ID or alias
	 * @param array        $args        Retrieve params
	 *
	 * @return string|void
	 */
	public function document( $documentID = 0, $args = [] ){
		$isPrivilegedUser = \Depicter::authorization()->currentUserCan( [ 'manage_options', 'publish_depicter' ] );

		$defaults = [
			'loadStyleMode' => 'auto',// ["auto", "inline", "file"]."auto" loads custom css if available, otherwise prints styles inline
			'useCache'      => true,
			'echo'          => true,
			'status'        => 'publish',
			'showUnpublishedNotice' => $isPrivilegedUser
		];

		$args = Arr::merge( $args, $defaults );

		if ( $isPrivilegedUser ) {
			$args['status'] = ['publish', 'draft'];
			$args['useCache'] = false;
			$args['loadStyleMode'] = 'inline';
		}

		$args['isPrivilegedUser'] = $isPrivilegedUser;

		$output = $this->getDocument( $documentID, $args ); // retrieves escaped slider markup

		if( $args['echo'] ){
			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} else {
			return $output;
		}
	}

	/**
	 * Retrieves a document markup
	 *
	 * @param int|string   $documentID  Document ID or alias
	 * @param array        $args        Retrieve params
	 *
	 * @return string
	 */
	protected function getDocument( $documentID = '', $args = [] )
	{
		if ( empty( $documentID ) ) {
	        return esc_html__( 'Slider ID is required.', 'depicter' );
	    }
		if( $args['useCache'] && ( false !== $cacheOutput = $this->getDocumentCache( $documentID, $args ) ) ){
			return $cacheOutput . '<span hidden>Depicter cache hit.</span>';
		}

		$output = '';
		$where  = [ 'status' => $args['status'] ];
		$styleGeneratorArgs = isset( $args['addImportant'] ) ? [ 'addImportant' => $args['addImportant'] ] : [];

		try{
			if( ! $documentID = \Depicter::document()->getID( $documentID ) ){
				return esc_html__( 'Slider alias not found.', 'depicter' );
			}

			if( $args['showUnpublishedNotice'] ){
				$output .= $this->getUnPublishedNoticeMarkup( $documentID );
			} elseif( \Depicter::document()->repository()->isNotPublished( $documentID, $where ) ) {
				throw new DocumentNotPublished( __( 'Slider is not published yet and saved as "draft"', 'depicter' ), 0, $where );
			}

			if( $documentModel = \Depicter::document()->getModel( $documentID, $where ) ){

				$output .= $documentModel->prepare()->render();
				$documentModel->styleGenerator( $styleGeneratorArgs );

				if( $args['isPrivilegedUser'] ){
					$documentModel->saveCss();
				}

				if( ( $args['loadStyleMode'] == 'inline' ) ){
					$output = $documentModel->getInlineCssTag() . $output;

				// fallback to inline if css file cannot be generated
				} elseif( in_array( $args['loadStyleMode'], [ 'auto', 'file' ] ) ) {
					if( ! $documentModel->getCssFileUrl() ){
						$output = $documentModel->getInlineCssTag() . $output;
					}
				}

				//----------

				$cssLinksToEnqueue = $documentModel->getCustomCssFiles( 'all' );

				$this->cache->set( $documentID . '_css_files', $cssLinksToEnqueue, WEEK_IN_SECONDS );

				// sanitize the output before caching
		        $output = Sanitize::html( $output, null, 'depicter/output' );

				if( $args['useCache'] ){
					$this->setDocumentCache( $documentID, $output, $args );
				} else {
					$this->deleteDocumentCache( $documentID, $args );
				}
			}

		} catch( \Exception $exception ){
			$output = Sanitize::html( $exception->getMessage() );
		}

		return $output;
	}


	/**
	 * Retrieves the cached markup and enqueues custom styles
	 *
	 * @param int   $documentID
	 * @param array $args
	 *
	 * @return bool|mixed
	 */
	protected function getDocumentCache( $documentID, $args = [] ){
		if( ( false !== $cacheOutput = $this->cache->get( $documentID ."_". $args['loadStyleMode'] ) ) && !empty( $cacheOutput ) ){
			return $cacheOutput;
		}
		return false;
	}

	/**
	 * Cache markup and styles
	 *
	 * @param int    $documentID
	 * @param string $content
	 * @param array  $args
	 *
	 * @return bool
	 */
	protected function setDocumentCache( $documentID, $content, $args = [] ){
		return $this->cache->set( $documentID ."_". $args['loadStyleMode'], $content, WEEK_IN_SECONDS );
	}

	/**
	 * Flushes a document cache
	 *
	 * @param int    $documentID
	 * @param array  $args
	 *
	 * @return bool
	 */
	protected function deleteDocumentCache( $documentID, $args = [] ){
		return $this->cache->delete( $documentID ."_". $args['loadStyleMode'] );
	}

	/**
	 * Get unpublished notice markup if document is not published
	 *
	 * @param int   $documentID
	 * @param array $args
	 *
	 * @return string
	 */
	public function getUnPublishedNoticeMarkup( $documentID, $args = [] ){
		if( $document = \Depicter::document()->repository()->findById( $documentID ) ){
			$document = $document->toArray();

			if ( $document['status'] == 'draft' ) {
				return  \Depicter::view('admin/notices/slider-draft-notice')->with( 'view_args', [
					'isNotPublished' => true,
					'editUrl'        => \Depicter::editor()->getEditUrl( $documentID )
				])->toString();
			}
		}

		return '';
	}

}
