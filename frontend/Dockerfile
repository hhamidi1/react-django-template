# Use an official Node.js runtime as the base image
FROM node:21-alpine3.18 as BUILD_IMAGE
# Set the working directory in the container
WORKDIR /app/frontend
# Copy only the package.json and package-lock.json to the container
COPY ./package*.json ./
# Install the application dependencies
RUN npm install
# Copy the entire application to the container
COPY ./ .
#build application
RUN npm run build

#multi-stage build
FROM node:21-alpine3.18 as PRODUCTION_IMAGE

WORKDIR /app/frontend
COPY --from=BUILD_IMAGE /app/frontend/dist /app/frontend/dist

# Expose the port
EXPOSE 8080

COPY package.json .
COPY vite.config.ts .
RUN npm install typescript
EXPOSE 8080

# Command to run the application
CMD [ "npm", "run", "preview" ]