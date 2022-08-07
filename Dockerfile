FROM node:current-alpine3.16

RUN apk update

RUN mkdir -p /home/bilibili-dl-api
COPY . /home/bilibili-dl-api
WORKDIR /home/bilibili-dl-api

EXPOSE 3000

RUN npm install pnpm --location=global
RUN pnpm install

CMD ["node", "."]
