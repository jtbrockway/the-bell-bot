FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Copy package into WORKDIR and install dependencies
COPY package*.json ./
RUN npm install

#Bundle app src
COPY . .

#Expose app and start
EXPOSE 3000
CMD [ "npm", "start" ]