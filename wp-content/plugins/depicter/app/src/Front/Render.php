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
		$isPrivilegedUser = current_user_can('manage_options') || current_user_can('publish_depicter');

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
		}

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
		if( $args['useCache'] && ( false !== $cacheOutput = $this->getDocumentCache( $documentID ) ) ){
			return $cacheOutput . '<span hidden>Depicter Cache hit!</span>';
		}

		$output = '';
		$where  = [ 'status' => $args['status'] ];
		$styleGeneratorArgs = isset( $args['addImportant'] ) ? [ 'addImportant' => $args['addImportant'] ] : [];

		try{
			if ( ! is_numeric( $documentID ) && is_string( $documentID ) ) {
		        if ( ! $document = \Depicter::document()->repository()->findOne( null, ['slug' => $documentID] ) ) {
		            return esc_html__( 'Slider alias not found.', 'depicter' );
		        }
		        $documentID = $document->getID();
		    }

			if( $args['showUnpublishedNotice'] ){
				$output .= $this->getUnPublishedNoticeMarkup( $documentID );
			} elseif( \Depicter::document()->repository()->isNotPublished( $documentID, $where ) ) {
				throw new DocumentNotPublished( __( 'Slider is not published yet and saved as "draft"', 'depicter' ), 0, $where );
			}

			if( $documentModel = \Depicter::document()->getModel( $documentID, $where ) ){

				$output .= $documentModel->prepare()->render();
				$documentModel->styleGenerator( $styleGeneratorArgs );

				if( ( $args['loadStyleMode'] == 'inline' ) ){
					$output = $documentModel->getInlineCssTag() . $output;

				} elseif( ( $args['loadStyleMode'] == 'auto' ) ) {
					// fallback to inline if css file cannot be generated
					if( ! $documentModel->getCssFileUrl() ){
						$output = $documentModel->getInlineCssTag() . $output;
					}
				}

				//----------

				$cssLinksToEnqueue = $documentModel->getCustomCssFiles( [ 'google-font' ] );

				if( ( $args['loadStyleMode'] == 'auto' ) ) {
					if( $documentModel->getCssFileUrl() ){
						$cssLinksToEnqueue = $documentModel->getCustomCssFiles( 'all' );
					}

				} elseif( $args['loadStyleMode'] == 'file' ) {
					$cssLinksToEnqueue = $documentModel->getCustomCssFiles( 'all' );
				}

				if( $args['useCache'] ){
					$this->cache->set( $documentID . '_css_files', $cssLinksToEnqueue, WEEK_IN_SECONDS );
				}

				$this->enqueueCustomStyles( $cssLinksToEnqueue );

				// sanitize the output before caching
		        $output = Sanitize::html( $output, null, 'depicter/output' );

				if( $args['useCache'] ){
					$this->cache->set( $documentID, $output, WEEK_IN_SECONDS );
				} else {
					$this->cache->delete( $documentID );
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
	 * @param $documentId
	 *
	 * @return bool|mixed
	 */
	protected function getDocumentCache( $documentId ){
		if( ( false !== $cacheOutput = $this->cache->get( $documentId ) ) && !empty( $cacheOutput ) ){
			if( false !== $cssLinksToEnqueue = $this->cache->get( $documentId . '_css_files' ) ){
				$this->enqueueCustomStyles( $cssLinksToEnqueue );
			}
			return $cacheOutput;
		}

		return false;
	}

	/**
	 * Enqueues css links in footer
	 *
	 * @param $cssLinksToEnqueue
	 */
	protected function enqueueCustomStyles( $cssLinksToEnqueue ){
		if( $cssLinksToEnqueue && is_array( $cssLinksToEnqueue ) ){
			add_action( 'wp_footer', function() use ( $cssLinksToEnqueue ){
				foreach( $cssLinksToEnqueue as $cssId => $cssLink ){
					\Depicter::core()->assets()->enqueueStyle( $cssId, $cssLink );
				}
			} );
		}
	}

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
