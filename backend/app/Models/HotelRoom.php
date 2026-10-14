<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelRoom extends Model
{
    protected $fillable = ['room_number', 'room_type', 'nightly_rate'];

    protected function casts(): array
    {
        return ['nightly_rate' => 'decimal:2'];
    }
}
