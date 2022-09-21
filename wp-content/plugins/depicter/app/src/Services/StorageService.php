<?php
namespace Depicter\Services;


use Averta\WordPress\File\FileSystem;
use Averta\WordPress\File\UploadsDirectory;

class StorageService
{
	const UPLOADS_FOLDER_NAME = 'depicter';

	/**
	 * @var FileSystem
	 */
	private $filesystem;

	/**
	 * @var UploadsDirectory
	 */
	private $uploads;


	public function __construct(){
		$this->filesystem = new FileSystem();
		$this->uploads = new UploadsDirectory();
	}

	/**
	 * Access to filesystem module
	 *
	 * @return FileSystem
	 */
	public function filesystem(){
		return $this->filesystem;
	}

	/**
	 * Access to uploads directory info
	 *
	 * @return UploadsDirectory
	 */
	public function uploads(){
		return $this->uploads;
	}

	/**
	 * Retrieves the special plugin's folder in uploads directory
	 *
	 * @return string
	 */
	public function getPluginUploadsDirectory(){
		return $this->uploads()->getBaseDirectory() . '/'. self::UPLOADS_FOLDER_NAME;
	}

}
