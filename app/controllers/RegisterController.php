<?php

namespace app\controllers;

use app\models\UserModel;

class RegisterController {
    
    private $userModel;
    
    public function __construct($db) {
        $this->userModel = new UserModel($db);
    }
    
    /**
     * Display registration page
     */
    public function index() {
        return view('register');
    }
    
    /**
     * Handle user registration
     */
    public function store() {
        // Only accept POST requests
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            return json_encode(['success' => false, 'message' => 'Method not allowed']);
        }
        
        // Get POST data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate input
        $errors = $this->validateInput($data);
        
        if (!empty($errors)) {
            http_response_code(400);
            return json_encode(['success' => false, 'errors' => $errors]);
        }
        
        // Set user model properties
        $this->userModel->firstName = $data['firstName'] ?? null;
        $this->userModel->lastName = $data['lastName'] ?? null;
        $this->userModel->email = $data['username']; // Use username as email identifier
        $this->userModel->password = $data['password'];
        $this->userModel->status = 'active';
        
        // Attempt to create user
        if ($this->userModel->create()) {
            http_response_code(201);
            return json_encode([
                'success' => true, 
                'message' => 'Account created successfully!',
                'data' => [
                    'username' => $data['username']
                ]
            ]);
        } else {
            http_response_code(400);
            return json_encode(['success' => false, 'message' => 'Username already exists']);
        }
    }
    
    /**
     * Validate registration input
     */
    private function validateInput($data) {
        $errors = [];
        
        // Validate username
        if (empty($data['username'])) {
            $errors['username'] = 'Username is required';
        } elseif (strlen($data['username']) < 3) {
            $errors['username'] = 'Username must be at least 3 characters';
        } elseif (!preg_match('/^[a-zA-Z0-9_-]+$/', $data['username'])) {
            $errors['username'] = 'Username can only contain letters, numbers, hyphens and underscores';
        }
        
        // Check if username already exists
        if (!empty($data['username']) && $this->userModel->exists($data['username'])) {
            $errors['username'] = 'Username already taken';
        }
        
        // Validate password
        if (empty($data['password'])) {
            $errors['password'] = 'Password is required';
        } elseif (strlen($data['password']) < 8) {
            $errors['password'] = 'Password must be at least 8 characters';
        } elseif (!preg_match('/[A-Z]/', $data['password'])) {
            $errors['password'] = 'Password must contain at least one uppercase letter';
        } elseif (!preg_match('/[a-z]/', $data['password'])) {
            $errors['password'] = 'Password must contain at least one lowercase letter';
        } elseif (!preg_match('/[0-9]/', $data['password'])) {
            $errors['password'] = 'Password must contain at least one number';
        } elseif (!preg_match('/[!@#$%^&*]/', $data['password'])) {
            $errors['password'] = 'Password must contain at least one special character (!@#$%^&*)';
        }
        
        // Validate password confirmation
        if ($data['password'] !== $data['confirmPassword']) {
            $errors['confirmPassword'] = 'Passwords do not match';
        }
        
        // Validate terms agreement
        if (empty($data['agreeTerms'])) {
            $errors['agreeTerms'] = 'You must agree to the terms and conditions';
        }
        
        return $errors;
    }
}
