DOCKER_COMPOSE_FILE=srcs/docker-compose.yml

all:
	docker compose -f $(DOCKER_COMPOSE_FILE) up --build

down:
	docker compose -f $(DOCKER_COMPOSE_FILE) down

clean:
	docker compose -f $(DOCKER_COMPOSE_FILE) down --volumes

prune:
	docker system prune -af --volumes

hide:
	docker compose -f $(DOCKER_COMPOSE_FILE) up --build -d

ps:
	docker compose -f $(DOCKER_COMPOSE_FILE) ps

restart:
	docker compose -f $(DOCKER_COMPOSE_FILE) restart
