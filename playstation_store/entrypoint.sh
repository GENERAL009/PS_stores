#!/bin/bash

# Wait for database
echo "Waiting for database..."
DB_HOST="${DB_HOST:-5.252.195.161}"
DB_PORT="${DB_PORT:-3306}"
while ! python -c "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.connect(('${DB_HOST}', int('${DB_PORT}')))" 2>/dev/null; do
  sleep 1
done
echo "Database is ready!"

# Run migrations
python manage.py makemigrations users products orders
python manage.py migrate
python manage.py collectstatic --noinput

# Create superuser automatically
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@topgame.uz').exists():
    User.objects.create_superuser(
        email='admin@topgame.uz',
        password='admin123@$',
        first_name='Admin',
        last_name='User',
        phone_number='+998901234567'
    )
    print('Superuser created: admin@topgame.uz')
else:
    admin = User.objects.get(email='admin@topgame.uz')
    admin.set_password('admin123@$')
    admin.save()
    print('Superuser password updated')
EOF

# Start gunicorn
exec gunicorn --bind 0.0.0.0:8000 config.wsgi:application
