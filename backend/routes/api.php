<?php

use App\Http\Controllers\HotelRoomController;
use Illuminate\Support\Facades\Route;

Route::apiResource('rooms', HotelRoomController::class)->only(['index', 'store', 'show']);
