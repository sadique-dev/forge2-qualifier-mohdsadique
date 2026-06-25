FROM php:8.2-cli-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    unzip \
    libzip-dev \
    sqlite-dev \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-install pdo_sqlite zip bcmath

# Get official Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose default port
EXPOSE 80

# Make start.sh executable and run it
RUN chmod +x start.sh
CMD ["sh", "./start.sh"]
