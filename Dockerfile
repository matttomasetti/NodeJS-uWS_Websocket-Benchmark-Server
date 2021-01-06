FROM ubuntu

# Set timezone and environment variables
ENV TZ=America/New_York
ENV PATH=$PATH:/usr/bin/node
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Add source files to docker image
ADD .	/home/websocket

# Update and install dependencies
RUN apt-get -y update \
    && apt-get -y upgrade \
    && apt-get -y install curl git nodejs npm

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get -y install yarn \
    && cd /home/websocket

# Install node modules
RUN yarn install

EXPOSE 8080

WORKDIR /home/websocket
CMD ["node", "main.js"]
