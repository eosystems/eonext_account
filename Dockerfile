FROM node:11.13

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

RUN apt-get update && rm -rf /var/lib/apt/lists/*
RUN npm install --global pm2@3.4.1

WORKDIR /root
ARG CMD_YARN_VERSION=1.15.2
RUN npm install --global yarn@$CMD_YARN_VERSION && chmod +x /usr/local/bin/yarn

RUN npm install --global @vue/cli @vue/cli-init

ADD src /src
WORKDIR /src/app

RUN yarn install
EXPOSE 3001
EXPOSE 4000
CMD ["yarn", "run", "dev"]
