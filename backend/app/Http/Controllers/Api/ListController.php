<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\Request;

class ListController extends Controller
{
    public function store(Request $request, Board $board)
    {
        $data = $request->validate(['name' => 'required|string|max:255']);
        $position = $board->lists()->max('position') + 1;

        return $board->lists()->create([
            'name' => $data['name'],
            'position' => $position,
        ]);
    }

    public function update(Request $request, BoardList $list)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'position' => 'sometimes|integer',
        ]);
        $list->update($data);
        return $list;
    }

    public function destroy(BoardList $list)
    {
        $list->delete();
        return response()->noContent();
    }
}
