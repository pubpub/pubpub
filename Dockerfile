# 
# Dockerfile for containerizing PubPub, utilizing official Docker Inc
# base file

# Originally from https://github.com/tutumcloud/mongodb/tree/master/3.2

FROM       node:4.4.3
MAINTAINER colbygk@mit.edu

ENV APP_DIR /app
# Create app directory
RUN mkdir ${APP_DIR}
WORKDIR ${APP_DIR}

# Install app dependencies
COPY package.json ${APP_DIR}/.
RUN npm install

# Bundle app source
COPY . ${APP_DIR}

RUN npm run build

EXPOSE 8080
CMD [ "npm", "run", "start" ]

