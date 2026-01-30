# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy root package.json and dependencies
COPY package*.json ./
RUN npm install

# Copy client and build
COPY client ./client
RUN npm run build

# Final stage
FROM node:20-slim

WORKDIR /app

# Copy built files and server
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
