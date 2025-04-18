FROM node:22-alpine

WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
RUN npm install

# Copy prisma schema separately
COPY prisma ./prisma/

# Copy all other app files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Run Prisma generate again before starting and then start the server
CMD sh -c "npx prisma generate && node src/server.js"


