FROM node:20-alpine

WORKDIR /app

COPY ["package.json", "./"]

RUN npm install --silent --legacy-peer-deps

COPY . .

RUN adduser -D -u 501 appuser -G dialout

RUN chown -R appuser:dialout /app

USER appuser

CMD ["sh", "-c", "npm run dev"]
