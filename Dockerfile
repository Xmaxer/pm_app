FROM node:13.12.0-alpine
WORKDIR /client
ENV PATH /app/node_modules/.bin:$PATH
COPY . /client
RUN npm install -g pnpm
CMD ["pnpm", "install"]
CMD ["npm", "start"]
