<?php

namespace Depicter\Application;

use Averta\WordPress\Cache\WPCache;
use Averta\WordPress\Event\Action;
use Averta\WordPress\Event\Filter;
use Averta\WordPress\Models\WPOptions;
use Depicter;
use Depicter\Database\Repository\DocumentRepository;
use Depicter\Editor\Editor;
use Depicter\Front\Front;
use Depicter\Front\Symbols;
use Depicter\Services\ClientService;
use Depicter\Services\ExportService;
use Depicter\Services\ImportService;
use Depicter\Services\MediaBridge;
use Depicter\Services\RemoteAPIService;
use Depicter\Services\StorageService;
use Depicter\WordPress\DeactivationFeedbackService;
use Depicter\WordPress\FileUploaderService;
use WPEmergeAppCore\AppCore\AppCore;
use Depicter\WordPress\RoleManager;

/**
 * "@mixin" annotation for better IDE support.
 * This class is not meant to be used in any other capacity.
 *
 * @codeCoverageIgnore
 */
final class AppMixin
{

	/**
	 * Get the Application instance.
	 *
	 * @codeCoverageIgnore
	 * @return Depicter
	 */
	public static function app() {}

	/**
	 * Get the Theme service instance.
	 *
	 * @return AppCore
	 */
	public static function core() {}

	/**
	 * @return WPOptions
	 */
	public static function options() {}

	/**
	 * @return Depicter\Document\Manager
	 */
	public static function document() {}

	/**
	 * @return Action
	 */
	public static function action() {}

	/**
	 * @return Filter
	 */
	public static function filter() {}

	/**
	 * @return Editor
	 */
	public static function editor() {}

	/**
	 * @return MediaBridge
	 */
	public static function media() {}

	/**
	 * @return RemoteAPIService
	 */
	public static function remote() {}

	/**
	 * @return DocumentRepository
	 */
	public static function documentRepository() {}

	/**
	 * @return Front
	 */
	public static function front() {}

	/**
	 * @return StorageService
	 */
	public static function storage() {}

	/**
	 * Retrieves the cache module
	 *
	 * @param string $module
	 *
	 * @return WPCache
	 */
	public static function cache( $module = 'api' ){}

	/**
	 * @return DeactivationFeedbackService
	 */
	public static function deactivationFeedback(){}

	/**
	 * @return ClientService
	 */
	public static function client(){}

	/**
	 * @return FileUploaderService
	 */
	public static function fileUploader(){}

	/**
	 * @return Depicter\DataSources\Manager
	 */
	public static function dataSource(){}

	/**
	 * @return ExportService
	 */
	public static function exportService(){}

	/**
	 * @return ImportService
	 */
	public static function importService(){}

	/**
	 * @return Symbols
	 */
	public static function symbolsProvider(){}
}
