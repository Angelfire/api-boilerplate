# API Boilerplate

## Docker

### Build
This command builds the Docker image using the instructions in your `Dockerfile`. The `-t` flag tags the image with a name.
```sh
docker build -t your_image_name .
```

### Run Docker Compose
Use `docker-compose` to start all services defined in your `compose.yml` file. This command will pull any necessary images, build your services, and start the containers.
```sh
docker-compose up
```

### Run Docker Compose in Detached Mode (optional)
If you want your containers to run in the background, add the `-d` flag.
```sh
docker-compose up -d
```

### Check Running Containers
List all running Docker containers to verify everything is running as expected.
```sh
docker ps
```

### Stop Docker Compose
To stop and remove all containers defined in your docker-compose.yml, use the following command.
```sh
docker-compose down
```
