# BUILD
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm i

COPY . .
RUN npx prisma generate

RUN npm run build

# RUN
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm i --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=build /app/prisma ./prisma
COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x /app/entrypoint.sh
EXPOSE 3030

ENTRYPOINT ["/app/entrypoint.sh"]
