# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy files
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Expose port 4300
EXPOSE 4300

# Start the app
CMD ["npm", "run", "dev"]