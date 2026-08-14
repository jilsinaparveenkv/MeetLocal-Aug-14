FROM node:20-alpine

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Environment variable for API endpoint
ENV NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
