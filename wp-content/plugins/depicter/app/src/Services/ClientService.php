<?php
namespace Depicter\Services;

use Averta\WordPress\Utility\JSON;
use Depicter\GuzzleHttp\Exception\GuzzleException;

class ClientService
{
	/**
	 * ClientService constructor.
	 */
	public function __construct(){
		if ( empty( \Depicter::options()->get( 'version_initial' ) ) ) {
			\Depicter::options()->set( 'version_initial', DEPICTER_VERSION );
		}
	}

	/**
	 * Register client info
	 *
	 * @return void
	 */
	public function authorize() {

		if ( ! empty( \Depicter::cache('base')->get( 'is_client_registered' ) ) ) {
			return;
		}

		$params = [
			'form_params' => [
				'version'           => DEPICTER_VERSION,
				'version_initial'   => \Depicter::options()->get('version_initial'),
				'info'              => \Depicter::options()->get('info')
			]
		];

		try{
			$endpoint = \Depicter::remote()->endpoint() . 'v1/client/register';
			$response = \Depicter::remote()->post( $endpoint, $params );

			if ( $response->getStatusCode() == 200 || $response->getStatusCode() == 204 ) {
				$payload = JSON::decode( $response->getBody(), true );

				if ( ! empty( $payload['client_key'] ) ) {
					\Depicter::options()->set( 'client_key', $payload['client_key'] );
				}
			}

		} catch ( GuzzleException $e ) {
			try{
				$this->reportError([
					'issueType'         => 'depicter-wp-api',
					'issueRelatesTo'    => 'client-registration',
					'userDescription'   => $e->getMessage(). ' | ' . $params['headers']['user-agent']
				]);
			} catch( GuzzleException $e ){}
		}

		\Depicter::cache('base')->set( 'is_client_registered', true, DAY_IN_SECONDS );
	}

	/**
	 * Send user feedback
	 *
	 * @param  array  $bodyParams
	 *
	 * @return bool
	 * @throws GuzzleException
	 */
	public function reportIssue( $bodyParams = [] ) {
		$response = \Depicter::remote()->post( 'v1/report/issue', [
			'form_params' => $bodyParams
		]);
		return $response->getStatusCode() == 200;
	}

	/**
	 * Send user error reports
	 *
	 * @param  array  $bodyParams
	 *
	 * @return bool
	 * @throws GuzzleException
	 */
	public function reportError( $bodyParams = [] ) {
		$response = \Depicter::remote()->post( 'v1/report/error', [
			'form_params' => $bodyParams
		]);
		return $response->getStatusCode() == 200;
	}

	/**
	 * send subscriber
	 * @param  array  $bodyParams
	 *
	 * @return bool
	 * @throws GuzzleException
	 */
	public function subscribe( $bodyParams = [] ) {
		$response = \Depicter::remote()->post( 'v1/subscriber/store', [
			'form_params' => $bodyParams
		]);
		return $response->getStatusCode() == 200;
	}

}
