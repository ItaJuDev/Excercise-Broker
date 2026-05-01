FROM node:20-alpine

WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1

ARG API_URL_INTERNAL=http://api:3001/api
ENV API_URL_INTERNAL=$API_URL_INTERNAL

# Copy and install
COPY apps/web/package.json ./
RUN npm install --no-audit --no-fund

# Copy source and build
COPY apps/web/ ./
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
