FROM node:20.13.1-alpine3.18

# set the working directory to /app
WORKDIR /app

# copy package.json and package-lock.json to the working directory
# This is done before copying the rest of the files to take advantage of Docker’s cache
# If the package.json and package-lock.json files haven’t changed, Docker will use the cached dependencies
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the files to the working directory
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# expose port 5173 to tell Docker that the container listens on the specified network ports at runtime

# EXPOSE 5173

# Command to run the app
CMD ["npm", "start"]
