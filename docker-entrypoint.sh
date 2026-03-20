#!/bin/bash
set -e

echo "🚀 Starting IAGI-GEOSEA 2026 Application..."

# Wait for database
echo "⏳ Waiting for database connection..."
until php -r "
try {
    new PDO('mysql:host=db;dbname=pitiagic_geosea', 'pitiagic_geosea_admin', 'Wagyu312226');
    echo 'Database connected!';
    exit(0);
} catch (PDOException \$e) {
    exit(1);
}
" 2>/dev/null; do
    echo "  Waiting for database..."
    sleep 2
done

echo ""

# Override slow settings for local Docker
export SESSION_DRIVER=file
export CACHE_STORE=file

# Clear and cache config
echo "🔧 Configuring Laravel..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (skip if tables already exist from SQL import)
echo "📦 Checking database migrations..."
php artisan migrate --force 2>/dev/null || echo "  Migrations skipped (tables already exist from SQL import)"

# Storage link
php artisan storage:link 2>/dev/null || true

# Set permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true

echo ""
echo "✅ Application is ready!"
echo "🌐 Web: http://localhost:8000"
echo "🗄️  phpMyAdmin: http://localhost:8080"
echo ""

# Start Apache (foreground)
apache2-foreground
