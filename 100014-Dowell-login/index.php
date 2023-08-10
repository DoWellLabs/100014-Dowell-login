<?php
/**
 * Plugin Name:       Dowell Login
 * Description:       Login plugin.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            uxlivinglab
 * License:           GPL-2.0-or-later
 * Text Domain:       Dowell login
 */
/*
 Define Plugin Constants
*/
define('DC_PATH', trailingslashit(plugin_dir_path(__FILE__)));
define('DC_URL', trailingslashit(plugins_url('/', __FILE__)));

require_once DC_PATH . 'models/LoginMenu.php';

add_action('admin_enqueue_scripts', 'login_admin_enqueue_scripts');
add_action('wp_enqueue_scripts', 'login_admin_enqueue_scripts');

function login_admin_enqueue_scripts() {
    wp_enqueue_style( 'login-style', plugin_dir_url( __FILE__ ) . 'build/index.css' );
    wp_enqueue_script( 'login-script', plugin_dir_url( __FILE__ ) . 'build/index.js', array( 'wp-element','react','react-dom' ),'10', true );
}
