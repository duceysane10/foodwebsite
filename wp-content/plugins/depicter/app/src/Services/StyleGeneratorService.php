<?php
namespace Depicter\Services;

use Averta\Core\Utility\Arr;
use Averta\WordPress\Utility\Sanitize;
use Depicter\Document\CSS\Breakpoints;
use Depicter\Document\Models\Traits\HasDocumentIdTrait;

class StyleGeneratorService
{
	use HasDocumentIdTrait;

	/**
	 * @var string
	 */
	protected $css;

	/**
	 * Document raw styles list
	 * @var array
	 */
	private $stylesList;

	/**
	 * Is filesystem writable or not
	 *
	 * @var bool
	 */
	protected $isWritable = true;

	/**
	 * Class extra options
	 *
	 * @var array
	 */
	protected $args = [];


	public function __construct( $stylesList = [], $documentID = 0, $args = [] ) {
		$this->setDocumentId( $documentID );
		$this->setStylesList( $stylesList );

		$this->args = Arr::merge( $args, [
			'addImportant' => false
		]);
	}

	public function setStylesList( $stylesList ){
		if ( $stylesList ) {
			$this->stylesList = $stylesList;
		}
	}

	/**
	 * Generate Css Styles
	 *
	 * @param array $stylesList
	 *
	 * @return string
	 */
	protected function generateCss( $stylesList = [] ) {

		if ( empty( $stylesList ) ) {
			return '';
		}

		$devices = Breakpoints::names();
		$breakpoints = Breakpoints::all();

		$default = "\n";
		$tablet  = '';
		$mobile  = '';
		$custom_style = '';
		$maybeImportantSuffix = $this->args['addImportant'] ? ' !important' : '';

		foreach ( $stylesList as $selector => $cssProperties ) {

			if ( !empty( $cssProperties['customStyle'] ) ) {
				$custom_style .= $cssProperties['customStyle'] . "\n";
			}

			foreach ( $devices as $device ) {
				if ( !empty( $cssProperties[ $device ] ) ) {
					$$device .= $selector . "{\n";
					foreach ( $cssProperties[ $device ] as $property => $value ) {
						$$device .= "\t{$property}:{$value}{$maybeImportantSuffix};\n";
					}
					$$device .= "}\n";
				}

				// check for hover styles
				if ( !empty( $cssProperties['hover'][ $device ] ) ) {
					$$device .= $selector . ":hover {\n";
					foreach ( $cssProperties['hover'][ $device ] as $property => $value ) {
						$$device .= "\t{$property}:{$value}{$maybeImportantSuffix};\n";
					}
					$$device .= "}\n";
				}
			}
		}

		if( $tablet ){
			$tablet = "\n/***** Tablet *****/\n@media screen and (max-width: {$breakpoints['tablet']}px){\n\n{$tablet}\n}";
		}
		if( $mobile ){
			$mobile = "\n/***** Mobile *****/\n@media screen and (max-width: {$breakpoints['mobile']}px){\n\n{$mobile}\n}";
		}

		$this->css = $default . $tablet . $mobile;

		if( $custom_style ){
			$this->css .= "\n/*** Custom styles ***/\n$custom_style";
		}

		return $this->css;
	}

	/**
	 * Retrieves CSS with style tag
	 *
	 * @param bool $forceRegenerateStyles
	 *
	 * @return string
	 */
	public function getCssAndTag( $forceRegenerateStyles = false ) {
		return "<style>\n" . $this->getCss( $forceRegenerateStyles ) . "</style>\n";
	}

	/**
	 * Prints CSS with style tag
	 *
	 * @param bool $forceRegenerateStyles
	 */
	public function printCssAndTag( $forceRegenerateStyles = false ) {
		echo Sanitize::html( $this->getCSSAndTag( $forceRegenerateStyles ) );
	}

	/**
	 * Print CSS inline
	 *
	 * @param bool $forceRegenerateStyles
	 *
	 * @return string
	 */
	public function getCss( $forceRegenerateStyles = false ) {
		if( ! $this->css || $forceRegenerateStyles  ){
			$this->generateCss( $this->stylesList );
		}
		return $this->css . "\n";
	}

	/**
	 * Save CSS in upload folder
	 *
	 * @param bool $forceRegenerateStyles
	 *
	 * @return StyleGeneratorService
	 */
	public function saveCss( $forceRegenerateStyles = false ) {
		$this->isWritable =\Depicter::storage()->filesystem()->write( $this->getCssFilePath(), $this->getCss( $forceRegenerateStyles ) );

		return $this;
	}

	/**
	 * Retrieves the path to generated css file for current document
	 *
	 * @param bool $checkExistence
	 *
	 * @return bool|string   false on not founding the file
	 */
	public function getCssFilePath( $checkExistence = false ){
		$cssFile = \Depicter::storage()->getPluginUploadsDirectory() . '/css/' . $this->getDocumentID() . '.css';
		if( $checkExistence ){
			return file_exists( $cssFile ) ? $cssFile : false;
		}
		return $cssFile;
	}

	/**
	 * Retrieves the url of generated css file for current document
	 *
	 * @return bool|string  false on not founding the file
	 */
	public function getCssFileUrl(){
		$uploadsDirectory = \Depicter::storage()->uploads();
		$relativeFilePath = '/depicter/css/' . $this->getDocumentID() . '.css';

		if( file_exists( $uploadsDirectory->getBaseDirectory() . $relativeFilePath ) ){
			return $uploadsDirectory->getBaseUrl() . $relativeFilePath;
		}

		return false;
	}

	/**
	 * Whether filesystem is writable or not
	 *
	 * @return bool
	 */
	public function isWritable(){
		return $this->isWritable;
	}
}
