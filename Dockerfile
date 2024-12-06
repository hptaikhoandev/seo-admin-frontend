FROM node:20-alpine

WORKDIR /app

COPY ["package.json", "./"]

COPY . .

CMD ["sh", "-c", "npm install && npm run build && npm run start"]
