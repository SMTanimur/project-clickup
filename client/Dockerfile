# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build the application (if using React or similar)
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 