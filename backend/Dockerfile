FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
COPY init.sql ./init.sql
EXPOSE 5000
CMD ["npm", "start"]
