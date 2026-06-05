FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/backend/package*.json ./apps/backend/
RUN npm install
COPY apps/backend ./apps/backend
RUN npm run build -w apps/backend

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/
RUN npm install --omit=dev
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
EXPOSE 3000
CMD ["node", "apps/backend/dist/main.js"]
