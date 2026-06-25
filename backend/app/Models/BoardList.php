<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Named BoardList because "List" is a reserved word in PHP.
// The database table is still called "lists" (see config/table name below).
class BoardList extends Model
{
    protected $table = 'lists';

    protected $fillable = ['board_id', 'name', 'position'];

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class, 'list_id')->orderBy('position');
    }
}
