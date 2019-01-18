FROM node:8.9.1-alpine

ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /frontend
WORKDIR /frontend

# Copy
COPY package.json package-lock.json ./
RUN npm install

# Copy frontend source code
COPY . .
RUN npm run build

EXPOSE 80
EXPOSE 3000

CMD [ "npm", "start" ]
