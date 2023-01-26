FROM node:16.14-alpine

WORKDIR /app-frontend

EXPOSE 3000

COPY package* ./

RUN npm install

COPY . .

CMD ["npm", "start"]