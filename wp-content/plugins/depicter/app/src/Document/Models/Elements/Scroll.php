<?php
namespace Depicter\Document\Models\Elements;

use Depicter\Html\Html;

class Scroll extends Svg {

	/**
	 * render scroll markup
	 * @return \TypeRocket\Html\Html|void
	 */
	public function render() {
		$args = $this->getDefaultAttributes();
		return Html::div( $args, "\n" . $this->options->content . "\n" );
	}

	/**
	 * Get svg selector
	 *
	 * @return string
	 */
	public function getSvgSelector() {
		return '.' . $this->getSelector() . ' svg';
	}

}
