<?php
<<<<<<< HEAD
return [
    
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Method harus '*' (artinya semua method dibolehkan)
    'allowed_methods' => ['*'], 

    // Origin harus spesifik URL React agar supports_credentials bekerja
    'allowed_origins' => ['http://localhost:5173'], 

    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,

];
=======

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'auth/google/callback'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,  
];
>>>>>>> 1c1f00469ff9d80460dcda467a83a5167f203fc4
