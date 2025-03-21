# Dockerfile.vite-react
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY frontend/React/package.json frontend/React/package-lock.json ./
RUN npm install

# Copy the rest of the React app
COPY frontend/React .

# Expose port 5173 for Vite
EXPOSE 5173

# Start Vite in dev mode with hot reload
CMD ["npm", "run", "dev"]