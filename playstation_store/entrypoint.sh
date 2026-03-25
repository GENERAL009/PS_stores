#!/bin/bash

# Wait for database
echo "Waiting for database..."
while ! python -c "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.connect(('db', 3306))" 2>/dev/null; do
  sleep 1
done
echo "Database is ready!"

# Run migrations
python manage.py makemigrations users products orders
python manage.py migrate
python manage.py collectstatic --noinput

# Create superuser with password 'admin123@$'
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@example.com').exists():
    User.objects.create_superuser(
        email='admin@example.com', 
        password='admin123@$',
        first_name='Admin',
        last_name='User',
        phone_number='+998901234567'
    )
    print('Superuser created successfully')
else:
    # Update existing admin password
    admin = User.objects.get(email='admin@example.com')
    admin.set_password('admin123@$')
    admin.save()
    print('Superuser password updated to admin123@$')
EOF

# Start gunicorn
exec gunicorn --bind 0.0.0.0:8000 config.wsgi:application
