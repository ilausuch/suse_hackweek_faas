FROM node:latest

COPY . /opt
WORKDIR /opt
RUN rm -Rf .git
RUN yarn global add serve
RUN yarn
RUN chmod a+x entrypoint.sh

EXPOSE 5000

CMD ["./entrypoint.sh"]
