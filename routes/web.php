<?php

use Illuminate\Support\Facades\Route;

// Route::statamic('example', 'example-view', [
//    'title' => 'Example'
// ]);
// Homepage route

// Games index route
Route::get('/games', function () {
    return view('games.index');
})->name('games.index');

// Apps index route
Route::get('/apps', function () {
    return view('apps.index');
})->name('apps.index');

// Tools index route
Route::get('/tools', function () {
    return view('tools.index');
})->name('tools.index');
