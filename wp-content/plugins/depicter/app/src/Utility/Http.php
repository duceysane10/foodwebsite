<?php
namespace Depicter\Utility;

class Http {

	public static function getErrorExceptionResponse( \Exception $exception ){
		$isConnectionError = method_exists( $exception, 'getHandlerContext' );
		$errorClassInstance = get_class( $exception );

		$error = [
			'message'    => $exception->getMessage(),
			'detail'     => $exception->getMessage(),
			'errCode'    => $exception->getCode(),
			'group'      => 'Exception', // name of exception group
			'type'       => basename( str_replace('\\', '/',  $errorClassInstance )), // unqualified (short) exception class name
			'instance'   => $errorClassInstance,
			'context'    => null,
			'statusCode' => 500
		];

		if( $isConnectionError ){
			$error['message']    = __( 'Connection Error ..', 'depicter' );
			$error['group']      = 'RequestException';
			$error['context']    = $exception->getHandlerContext();
			$error['statusCode'] = 503;
		}

		if( ! empty( $error['context']['error'] ) ){
			$error['detail'] = $error['context']['error'];
		}
		if( ! empty( $error['context']['errno'] ) ){
			$error['errCode'] = $error['context']['errno'];
		}

		return $error;
	}
}
