FROM node

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i -g @angular/cli

RUN npm i

COPY . .

CMD [ "ng", "serve", "--host", "0.0.0.0" ]