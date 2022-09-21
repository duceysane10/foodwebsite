<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'food' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'd281Rjb-D~*Ed9M;InXvi}4[?*+]Rc4$Y)c{|E52}R~>US97)U6fvRe{%mKNyd_g' );
define( 'SECURE_AUTH_KEY',  'vEcj8E!<>Aygvu1,2P>;ujf(34x6%([WoAAHMM vjpl!ki8-M4cQ]HaI;u-1)GuS' );
define( 'LOGGED_IN_KEY',    'ZkpN@:>)tZi*MlE[]CkAe@>9!,$R^;]`dO+(t;<A{Of1;!.E0f4`v[g>Uh4p~8$x' );
define( 'NONCE_KEY',        '+*h$6^wNh+(?v1LjncLck8|?]FRMkf*bAK0dz3eQtHh(6, Mx&B@fMQTWPetA9D_' );
define( 'AUTH_SALT',        '#$LjENh/F-9~Ya{?&Kb~8HKo3^@pcTg4+B%KF2$f.efr=] j}6%4z?b4K9<B0wEz' );
define( 'SECURE_AUTH_SALT', 'de{gR8ZW}%jzUv}MnCvb}*G1_>m36M|E1!jI`As+|ieOQN)xOSgK&w!E5ug/_?:6' );
define( 'LOGGED_IN_SALT',   'na/5jJ]Y I 5_(!ZXpY}G9<[|(U6*pU!We~/~08@p8TC^,/oPhi4@0HvP_v9t$jt' );
define( 'NONCE_SALT',       'j7FNbfqb@*2!#X9z)DVnh!#@B`BNI{B+VFe-lmSIA{v`)]k&}||(3#6up N#A(^V' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
