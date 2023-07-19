<?php
class Dowell_Login {

public function __construct(){
    add_action('admin_menu', [$this, 'login_init_menu']);    
}

public function login_init_menu() {
    add_menu_page( __( 'Login plugin', 'dowelllogin'), __( 'Login plugin', 'dowelllogin'), 'manage_options', 'dowelllogin', [$this, 'render_login_page'], 'dashicons-admin-post', '2.1' );
}


public function render_login_page (){
    echo '<div id="login-plugin"></div>';

}

}

function dowell_Login_init() {
$plugin = new Dowell_Login();
add_shortcode('dowell_login', [$plugin, 'render_login_page']);
}

add_action('plugins_loaded', 'dowell_Login_init');
