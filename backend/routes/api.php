<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HotelRoomController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockMovementController;
use Illuminate\Support\Facades\Route;

Route::get('dashboard', DashboardController::class);
Route::apiResource('products', ProductController::class);
Route::get('stock-movements', [StockMovementController::class, 'index']);
Route::post('stock-movements', [StockMovementController::class, 'store']);
Route::apiResource('rooms', HotelRoomController::class)->only(['index', 'store', 'show']);
