node_image_version=18.16
aws_profile=default
docker_network=boilerplate-serverless_boilerplate_serverless_network
docker_service_apps_container=boilerplate_serverless
aws_sam_template_path=./aws/cloudformation/main-template.yaml

## Write command to build and start application
.PHONY: help

help:
	$(info ${HELP_MESSAGE})
	@exit 0

install:
	docker run --rm -v "${PWD}/apps":/var/app/current -w /var/app/current node:$(node_image_version) npm install

dev:
	docker-compose up

start-api:
	sam local start-api -t $(aws_sam_template_path) --docker-network $(docker_network) --profile $(aws_profile) --skip-pull-image -l logs

build:
	sam build -t $(aws_sam_template_path) --skip-pull-image

invoke:
	sam local invoke -t $(aws_sam_template_path) $(func) -e $(event) --docker-network $(docker_network) -l logs  --profile $(aws_profile)

validate:
	sam validate -t $(aws_sam_template_path)

exec-app:
	docker exec -ti $(docker_service_apps_container) bash

db-migrate-local:
	docker run --rm -v "${PWD}/apps":/var/app/current --network $(docker_network) -w /var/app/current node:$(node_image_version) npm run db-migrate

db-seed-local:
	docker run --rm -v "${PWD}/apps":/var/app/current --network $(docker_network) -w /var/app/current node:$(node_image_version) npm run db-seed

db-create-client:
	docker run --rm -v "${PWD}/apps":/var/app/current -w /var/app/current node:$(node_image_version) npx prisma generate

db-deploy:
	docker run --rm -v "${PWD}/apps":/var/app/current -w /var/app/current node:$(node_image_version) npx prisma migrate deploy

db-push:
	docker run --rm -v "${PWD}/apps":/var/app/current --network $(docker_network) -w /var/app/current node:$(node_image_version) npx prisma db push

db-init:
	docker run --rm -v "${PWD}/apps":/var/app/current --network $(docker_network) -w /var/app/current node:$(node_image_version) npx prisma init

db-reset:
	docker run --rm -ti -v "${PWD}/apps":/var/app/current --network $(docker_network) -w /var/app/current node:$(node_image_version) npx prisma migrate reset --force

db-rollback:
	docker run --rm -v "${PWD}/apps":/var/app/current --network $(docker_network) -w /var/app/current node:$(node_image_version) npx prisma migrate reset --force

clean-prisma-runtime:
	./scripts/clean_prisma_runtime.sh

define HELP_MESSAGE

	Common usage:

	make install # Install the project dependencies

	make dev # Starts the local development server

	make start-api # Starts the sam local api

	make build # Builds the app via SAM

	make invoke # Invoke SAM function

	make validate # Validates the sam template for Errors

	make db-migrate-local # Command to run DB migration on your local machine

	make db-seed-local # Command to run DB seed on your local machine

	make db-create-client # Creates Prisma client for the local instance(Must run first before db-migrate-local)

	make db-reset # Resets the migration

	make db-deploy # Deploys the latest migration file into the Database

	make clean-prisma-runtime # Clear out the unnecessary file from Prisma that causes the package file size to bloat

endef