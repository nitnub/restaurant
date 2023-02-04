FROM node:alpine
WORKDIR /usr/yourapplication-name
COPY package.json .

#RUN npm install
RUN npm install\
  && npm install typescript -g
COPY . .
RUN tsc
EXPOSE 4000
CMD ["node", "./dist/server.js"]
