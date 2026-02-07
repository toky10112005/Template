<?php

use app\controllers\UserController;
use app\middlewares\SecurityHeadersMiddleware;
use flight\Engine;
use flight\net\Router;
 
/** 
 * @var Router $router 
 * @var Engine $app
 */

// This wraps all routes in the group with the SecurityHeadersMiddleware
$router->group('', function(Router $router) use ($app) {

	$router->map('/', function() use ($app) {
		$app->render('forms');
	});

	$router->get('/LoginForm', function() use ($app){
		$user=new UserController($app);
		$username=$_GET['username'];
		$result=$user->CheckUser($username);
		$app->render('messages', ['username'=>$result['nom'],'id'=>$result['id']]);
	});

	// $router->get('/hello-world/@name', function($name) {
	// 	echo '<h1>Hello world! Oh hey '.$name.'!</h1>';
	// });

	// $router->group('/api', function() use ($router) {
	// 	$router->get('/users', [ ApiExampleController::class, 'getUsers' ]);
	// 	$router->get('/users/@id:[0-9]', [ ApiExampleController::class, 'getUser' ]);
	// 	$router->post('/users/@id:[0-9]', [ ApiExampleController::class, 'updateUser' ]);
	// });


	
}, [ SecurityHeadersMiddleware::class ]);