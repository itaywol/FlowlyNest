FROM node:lts AS development

WORKDIR /usr/src/app

#RUN apt update && apt install --no-cache git curl musl cmake gcc gcompat

COPY package*.json ./

RUN npm install 

COPY . .

CMD npm run dev

FROM development AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN npm run build

CMD ["node", "dist/main"]
