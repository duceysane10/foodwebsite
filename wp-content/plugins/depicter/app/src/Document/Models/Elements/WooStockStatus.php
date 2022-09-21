<?php
namespace Depicter\Document\Models\Elements;

class WooStockStatus extends Text
{
	/**
	 * Retrieves the content of element
	 *
	 * @return string
	 */
	protected function getContent(){
		$content = $this->maybeReplaceDataSheetTags( $this->options->content );

		if( $content === 'In stock' ){
			$content = $this->options->stockStatus->inStockText ?? $content;
		} elseif( $content === 'Out of stock' ) {
			$content = $this->options->stockStatus->outOfStockText ?? $content;
		}

		return $content;
	}
}
