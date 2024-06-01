# API Boilerplate

## Docker

<details>
  <summary>Build</summary>
  This command builds the Docker image using the instructions in your `Dockerfile`. The `-t` flag tags the image with a name.

  ```sh
  docker build -t your_image_name .
  ```
</details>

<details>
  <summary>Run Docker Compose</summary>
  Use `docker-compose` to start all services defined in your `compose.yml` file. This command will pull any necessary images, build your services, and start the containers.

  ```sh
  docker-compose up
  ```
</details>

<details>
  <summary>Run Docker Compose in Detached Mode (optional)</summary>
  If you want your containers to run in the background, add the `-d` flag.

  ```sh
  docker-compose up -d
  ```
</details>

<details>
  <summary>Check Running Containers</summary>
  List all running Docker containers to verify everything is running as expected.

  ```sh
  docker ps
  ```
</details>

<details>
  <summary>Stop Docker Compose</summary>
  To stop and remove all containers defined in your docker-compose.yml, use the following command.

  ```sh
  docker-compose down
  ```
</details>

## Prisma

<details>
  <summary>Initialize Prisma in your project</summary>
  This command sets up Prisma in your project by creating a `prisma` directory with a `schema.prisma` file.

  ```sh
  npx prisma init
  ```
</details>

<details>
  <summary>Generate Prisma Client</summary>
  After defining your data model in the `schema.prisma` file, use this command to generate the Prisma Client

  ```sh
  npx prisma generate
  ```
</details>

<details>
  <summary>Migrate Database</summary>
  <details>
    <summary>Create a new migration</summary>
    Creates a new migration file based on the changes in your `schema.prisma` and applies it to your database.
    
    ```sh
    npx prisma migrate dev --name migration_name
    ```
  </details>
  <details>
    <summary>Apply pending migrations</summary>
    Applies all pending migrations to the database.

    ```sh
    npx prisma migrate deploy
    ```
  </details>
</details>

<details>
  <summary>Introspect Database</summary>
  Updates your `schema.prisma` file to reflect the current state of your database schema.

  ```sh
  npx prisma db pull
  ```
</details>

<details>
  <summary>Seed Database</summary>
  Executes the seeding script to populate your database with initial data.

  ```sh
  npx prisma db seed
  ```
</details>

<details>
  <summary>Open Prisma Studio</summary>
  Opens Prisma Studio, a GUI for viewing and editing data in your database.

  ```sh
  npx prisma studio
  ```
</details>
