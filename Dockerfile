FROM node:12
WORKDIR /appnodejs
ADD . /appnodejs
RUN npm install
EXPOSE 80
CMD npm start
