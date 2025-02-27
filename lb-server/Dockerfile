# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port and start app
EXPOSE 4200
CMD ["npm", "run", "dev"]

