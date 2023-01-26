FROM node:16.14-alpine

WORKDIR /app-backend

COPY package* ./

EXPOSE 3001

COPY . .

RUN npm install

ENTRYPOINT ["npm", "run"]

CMD ["start"]