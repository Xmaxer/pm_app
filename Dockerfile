FROM node:13.12.0-alpine
WORKDIR /client
COPY . /client
RUN npm install -g pnpm
RUN pnpm install
CMD ["npm", "start"]
