# Makefile
COMPOSE := docker compose

redis-up:
	$(COMPOSE) -f ./devtools/redis/docker-compose.yml up -d --build

redis-down:
	$(COMPOSE) -f ./devtools/redis/docker-compose.yml down

dev-up:
	$(COMPOSE) -f docker-compose.dev.yml up -d --build

dev-down:
	$(COMPOSE) -f docker-compose.dev.yml down

prod-up:
	$(COMPOSE) -f docker-compose.prod.yml up -d --build

prod-down:
	$(COMPOSE) -f docker-compose.prod.yml down

dev-clean:
	make dev-down
	make redis-down

dev:
	make redis-up
	make dev-up

