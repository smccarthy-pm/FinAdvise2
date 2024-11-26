FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose ports
EXPOSE 3000
EXPOSE 8000

# Start both frontend and backend
CMD ["npm", "run", "dev:all"]