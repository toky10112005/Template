<?php

namespace app\controllers;

use flight\Engine;
use Flight;
use app\models\UserModel;

class UserController {

	protected Engine $app;

	public function __construct($app) {
		$this->app = $app;
	}

    public function CheckUser($username){
        $db = Flight::db();

        $users = new UserModel($db, $username);

        $result=$users->CheckUser($username);
        if($result){
            $id=$users->getByName($username);
            return ['nom'=>$username,'id'=>$id['id']];
        }
        else{
            $this->InsertUsers($username);
            return ['nom'=>$username,'id'=>$users->getByName($username)['id']];
        }
        
    }

    public function InsertUsers($username){
        $db = $this->app->db();
        $users = new UserModel($db, $username);

        $result=$users->Insert();
        if($result){
            
            return ['message' => 'User created successfully'];
        } else {
           
            return ['message' => 'Failed to create user'];
        }

    }


}