.PHONY: build up down logs shell clean

# Build the Docker image
build:
	docker-compose build

# Start the containers
up:
	docker-compose up -d

# Stop the containers
down:
	docker-compose down

# View container logs
logs:
	docker-compose logs -f

# Open a shell in the container
shell:
	docker-compose exec clickup-clone sh

# Clean up Docker resources
clean:
	docker-compose down -v
	docker system prune -f 