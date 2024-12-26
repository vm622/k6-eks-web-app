FROM node:20-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .


FROM node:20-slim

WORKDIR /app

COPY --from=build /app .

EXPOSE 3000

CMD ["node", "index.js"]
