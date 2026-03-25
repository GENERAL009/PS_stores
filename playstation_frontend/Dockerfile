# Use an official Node runtime as a parent image
FROM node:20-slim AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:20-slim

WORKDIR /app

# Copy the build output and node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
