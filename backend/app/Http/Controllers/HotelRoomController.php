<?php

namespace App\Http\Controllers;

use App\Models\HotelRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class HotelRoomController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(HotelRoom::orderBy('room_number')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'room_number' => ['required', 'string', 'max:20', Rule::unique('hotel_rooms', 'room_number')],
            'room_type' => ['required', Rule::in(['Standard Single', 'Deluxe Double', 'Executive Suite', 'Penthouse'])],
            'nightly_rate' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
        ]);

        return response()->json(HotelRoom::create($validated), 201);
    }

    public function show(HotelRoom $room): JsonResponse
    {
        return response()->json($room);
    }
}
