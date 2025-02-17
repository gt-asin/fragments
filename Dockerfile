# Dockerfiles must begin with a FROM instruction that defines our environment
FROM node:22.13.0

# Define metadata for your image
LABEL maintainer="Anthony Sin <asin@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json
# files into the working dir (/app), using full paths and multiple source
# files.  All of the files will be copied into the working dir `./app`
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080

# Build image
# docker build -t fragments:latest .

# Run image in background. Left Port = host, Right Port = container
# docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 -d fragments:latest

# Real time logs for container
# docker logs -f <id>
