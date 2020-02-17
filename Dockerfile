FROM node:10-alpine

COPY . /opt
WORKDIR /opt
RUN rm -Rf .git
RUN yarn global add serve
RUN yarn
RUN chmod a+x entrypoint.sh

EXPOSE 3031
EXPOSE 3030

CMD ["./entrypoint.sh"]
