<?php

namespace Depicter\Services;

class AuthorizationService {

	/**
	 * @param string|array $capabilities
	 *
	 * @return bool
	 */
	public function currentUserCan( $capabilities ){
		if( empty( $capabilities ) ){
			return false;
		}

		$capabilities = (array) $capabilities;
		foreach( $capabilities as $capability ){
			if( current_user_can( $capability ) ){
				return true;
			}
		}

		return false;
	}
}
