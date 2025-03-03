# Dockerfiles must begin with a FROM instruction that defines our environment
# Stage 1: Install dependencies
FROM node:22.13.0-alpine@sha256:f2dc6eea95f787e25f173ba9904c9d0647ab2506178c7b5b7c5a3d02bc4af145 AS dependencies

# Define metadata for your image
LABEL maintainer="Anthony Sin <asin@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service, reduce npm spam, disable colour when running inside docker
ENV PORT=8080 \
  NPM_CONFIG_LOGLEVEL=warn \
  NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json
# files into the working dir (/app), using full paths and multiple source
# files.  All of the files will be copied into the working dir `./app`
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci

###############################################################
# Stage 2: Builds the project
FROM node:22.13.0-alpine@sha256:f2dc6eea95f787e25f173ba9904c9d0647ab2506178c7b5b7c5a3d02bc4af145 AS build

WORKDIR /app
COPY --from=dependencies /app /app

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

###############################################################
# Stage 3: Run the project
FROM node:22.13.0-alpine@sha256:f2dc6eea95f787e25f173ba9904c9d0647ab2506178c7b5b7c5a3d02bc4af145 AS run

WORKDIR /app
COPY --from=build /app /app

# Installs curl because alpine does not have it by default
RUN apk add --no-cache curl

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080

# Health Check for server every 30 seconds
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail localhost:8080 || exit 1


