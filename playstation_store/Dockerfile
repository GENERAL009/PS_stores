# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip setuptools
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Run the application
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
