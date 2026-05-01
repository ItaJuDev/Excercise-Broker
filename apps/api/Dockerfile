FROM node:20-alpine

WORKDIR /app/apps/api
RUN apk add --no-cache openssl

# Copy and install
COPY apps/api/package.json ./
RUN npm install --no-audit --no-fund

# Copy source and build
COPY apps/api/ ./
RUN npx prisma generate && npm run build

EXPOSE 3001
CMD sh -c "npx prisma migrate deploy && (npx prisma db seed || true) && node dist/main"
