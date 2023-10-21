node_image_version=18.16
aws_profile=default
docker_network=boilerplate-serverless_boilerplate_serverless_network
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

define HELP_MESSAGE

	Common usage:

	make install # Install the project dependencies

	make dev # Starts the local development server

	make start-api # Starts the sam local api

	make build # Builds the app via SAM

	make invoke # Invoke SAM function

	make validate # Validates the sam template for Errors

endef