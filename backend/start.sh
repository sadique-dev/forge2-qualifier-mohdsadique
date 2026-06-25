#!/bin/sh
set -e

# Ensure SQLite database exists
mkdir -p database
touch database/database.sqlite

# Run migrations
php artisan migrate --force

# Seed database only if it's empty
php artisan tinker --execute="if (\App\Models\Board::count() === 0) { \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]); }"

# Enable multi-threaded concurrent request handling in built-in PHP web server
export PHP_CLI_SERVER_WORKERS=4

# Start the built-in PHP web server on the port specified by Render
php artisan serve --host=0.0.0.0 --port=${PORT:-80}

