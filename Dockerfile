# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Remove development dependencies to reduce attack surface
RUN npm prune --production

# SECURITY: Set the user to 'node' instead of 'root'
# This is a critical production senior pattern.
USER node

# Expose port
EXPOSE 3000

# Start production build
CMD ["npm", "run", "start:prod"]
