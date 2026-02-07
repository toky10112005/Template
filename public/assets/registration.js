// Registration Form - Alpine.js Component
function RegistrationForm() {
    return {
        form: {
            username: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false
        },
        errors: {},
        isSubmitting: false,
        showPassword: false,
        passwordStrength: {
            level: 'weak',
            percentage: 0,
            color: 'danger',
            text: 'Weak'
        },
        
        /**
         * Initialize the form
         */
        init() {
            this.$watch('form.password', () => this.validatePassword());
        },
        
        /**
         * Validate a single field
         */
        validateField(field) {
            this.errors[field] = '';
            
            switch(field) {
                case 'username':
                    if (!this.form.username) {
                        this.errors.username = 'Username is required';
                    } else if (this.form.username.length < 3) {
                        this.errors.username = 'Username must be at least 3 characters';
                    } else if (!/^[a-zA-Z0-9_-]+$/.test(this.form.username)) {
                        this.errors.username = 'Username can only contain letters, numbers, hyphens and underscores';
                    }
                    break;
                    
                case 'password':
                    this.validatePassword();
                    break;
                    
                case 'confirmPassword':
                    if (this.form.password !== this.form.confirmPassword) {
                        this.errors.confirmPassword = 'Passwords do not match';
                    }
                    break;
            }
        },
        
        /**
         * Validate password with strength indicator
         */
        validatePassword() {
            const password = this.form.password;
            const confirmPassword = this.form.confirmPassword;
            this.errors.password = '';
            this.errors.confirmPassword = '';
            
            if (!password) {
                this.passwordStrength.level = 'weak';
                this.passwordStrength.percentage = 0;
                this.passwordStrength.color = 'danger';
                this.passwordStrength.text = 'Weak';
                return;
            }
            
            if (password.length < 8) {
                this.errors.password = 'Password must be at least 8 characters';
                this.passwordStrength.level = 'weak';
                this.passwordStrength.percentage = 25;
                this.passwordStrength.color = 'danger';
                this.passwordStrength.text = 'Too short';
                return;
            }
            
            let strength = 0;
            const checks = {
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[!@#$%^&*]/.test(password)
            };
            
            // Validate each requirement
            if (!checks.uppercase) {
                this.errors.password = 'Must contain an uppercase letter';
            }
            if (!checks.lowercase && !this.errors.password) {
                this.errors.password = 'Must contain a lowercase letter';
            }
            if (!checks.number && !this.errors.password) {
                this.errors.password = 'Must contain a number';
            }
            if (!checks.special && !this.errors.password) {
                this.errors.password = 'Must contain a special character (!@#$%^&*)';
            }
            
            // Calculate strength
            if (checks.uppercase) strength += 25;
            if (checks.lowercase) strength += 25;
            if (checks.number) strength += 25;
            if (checks.special) strength += 25;
            
            // Set strength level
            if (strength >= 100) {
                this.passwordStrength.level = 'strong';
                this.passwordStrength.color = 'success';
                this.passwordStrength.text = 'Strong';
            } else if (strength >= 75) {
                this.passwordStrength.level = 'good';
                this.passwordStrength.color = 'info';
                this.passwordStrength.text = 'Good';
            } else if (strength >= 50) {
                this.passwordStrength.level = 'fair';
                this.passwordStrength.color = 'warning';
                this.passwordStrength.text = 'Fair';
            } else {
                this.passwordStrength.level = 'weak';
                this.passwordStrength.color = 'danger';
                this.passwordStrength.text = 'Weak';
            }
            
            this.passwordStrength.percentage = strength;
            
            // Check if passwords match
            if (confirmPassword && password !== confirmPassword) {
                this.errors.confirmPassword = 'Passwords do not match';
            }
        },
        
        /**
         * Get field CSS class
         */
        getFieldClass(field) {
            return {
                'is-invalid': this.errors[field],
                'is-valid': !this.errors[field] && this.form[field]
            };
        },
        
        /**
         * Submit the form
         */
        async submitForm() {
            // Validate all fields
            this.validateField('username');
            this.validateField('password');
            this.validateField('confirmPassword');
            
            if (!this.form.agreeTerms) {
                this.errors.agreeTerms = 'You must agree to the terms and conditions';
            }
            
            // Check if there are any errors
            if (Object.values(this.errors).some(e => e)) {
                return;
            }
            
            this.isSubmitting = true;
            
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.form)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Success
                    alert('Account created successfully! Welcome, ' + result.data.username);
                    this.resetForm();
                    window.location.href = '/'; // Redirect or handle as needed
                } else {
                    // Error
                    if (result.errors) {
                        this.errors = result.errors;
                    } else {
                        alert(result.message || 'An error occurred');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Network error. Please try again.');
            } finally {
                this.isSubmitting = false;
            }
        },
        
        /**
         * Reset form
         */
        resetForm() {
            this.form = {
                username: '',
                password: '',
                confirmPassword: '',
                agreeTerms: false
            };
            this.errors = {};
            this.passwordStrength = {
                level: 'weak',
                percentage: 0,
                color: 'danger',
                text: 'Weak'
            };
        }
    };
}
