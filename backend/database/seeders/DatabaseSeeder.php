<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\Member;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $board = Board::create(['name' => 'Forge 2 Qualifier']);

        $todo = $board->lists()->create(['name' => 'To-Do', 'position' => 1]);
        $doing = $board->lists()->create(['name' => 'Doing', 'position' => 2]);
        $done = $board->lists()->create(['name' => 'Done', 'position' => 3]);

        $bug = Tag::create(['name' => 'bug', 'color' => '#e74c3c']);
        $design = Tag::create(['name' => 'design', 'color' => '#9b59b6']);

        $you = Member::create(['name' => 'Mohd Sadique', 'email' => 'member@example.com']);

        $card = $todo->cards()->create([
            'title' => 'Wire OpenClaw + Hermes through Slack',
            'description' => 'Set up the brain/hands loop in #sprint-main',
            'due_date' => now()->addDay()->format('Y-m-d'),
            'position' => 1,
        ]);
        $card->tags()->attach($bug->id);
        $card->members()->attach($you->id);

        $doing->cards()->create([
            'title' => 'Build Kanban API',
            'position' => 1,
        ]);
    }
}
