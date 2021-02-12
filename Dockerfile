FROM lts-alpine

# Create app directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Bundle APP files
COPY . /home/node/app/

# Install app dependencies
RUN npm install && npm run build && rm -rf node_modules && npm install --production

# Run the app
CMD [ "start", "build/app.js" ]

# Expose the listening port of your app
EXPOSE $PORT
