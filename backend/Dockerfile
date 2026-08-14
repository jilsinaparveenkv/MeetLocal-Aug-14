FROM node:20-alpine

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start production server
CMD ["npm", "start"]
