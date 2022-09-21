<?php

namespace Depicter\Document\Models\Traits;

trait HasDataSheetTrait {

	/**
	 * Current dataSource record (dataSheet)
	 * Only available if dataSource is assigned to the section
	 *
	 * @var array|null
	 */
	protected $dataSheet;


	/**
	 * Retrieves the dataSource record (dataSheet)
	 *
	 * @return array|null
	 */
	public function getDataSheet() {
		return $this->dataSheet;
	}

	/**
	 * Whether dataSheet is attached for this class or not
	 *
	 * @return bool
	 */
	public function hasDataSheet() {
		return !empty( $this->dataSheet );
	}

	/**
	 * Sets dataSheet
	 *
	 * @param array $dataSheet
	 */
	public function setDataSheet( $dataSheet ) {
		$this->dataSheet = $dataSheet;
	}

	/**
	 * Retrieves the current dataSheet ID if dataSource exits
	 *
	 * @return string
	 */
	public function getDataSheetID() {
		return $this->dataSheet['{{{uuid}}}'] ?? '';
	}

	/**
	 * Retrieves data tag value if exists
	 *
	 * @param $tag
	 *
	 * @return mixed|string
	 */
	public function getDataSheetTagValue( $tag ) {
		return $this->dataSheet[ $tag ] ?? '';
	}

	/**
	 * Retrieves url of this dataSheet
	 *
	 * @return string
	 */
	public function getDataSheetUrl() {
		return $this->dataSheet[ '{{{url}}}' ] ?? '';
	}

	/**
	 * Whether section is linked to corresponding dataSheet or not
	 *
	 * @return false
	 */
	public function isLinkedToDataSheet(){
		return $this->dataSheet[ '{{{linkSlides}}}' ] ?? false;
	}

	/**
	 * Replace dataSheets tags if exits
	 *
	 * @param $variable
	 *
	 * @return array|mixed|string|string[]
	 */
	protected function maybeReplaceDataSheetTags( $variable ){
		if( $dataSheet = $this->getDataSheet() ){
			return str_replace( array_keys( $dataSheet ), $dataSheet, $variable );
		}
		return $variable;
	}

	/**
	 * Replace dataSheets tags if exits
	 *
	 * @param string $variable
	 * @param string $tag
	 *
	 * @return string
	 */
	protected function maybeReplaceDataSheetTag( $variable, $tag = '' ){
		if( $dataSheet = $this->getDataSheet() ){
			if( !empty( $dataSheet[ $tag ] ) ){
				return str_replace( $tag, $dataSheet[ $tag ], $variable );
			}
		}
		return $variable;
	}
}
