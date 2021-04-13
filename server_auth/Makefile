.PHONY: build run

# Default values for variables
REPO_AUTH  ?= localhost:5000/ic2_auth
TAG_AUTH   ?= latest
IMAGE_AUTH ?= ic2_auth

build:
	docker build -t $(REPO_AUTH):$(TAG_AUTH) .
	docker push $(REPO_AUTH):$(TAG_AUTH)

run:
	docker run --privileged --rm  -d  \
		-p 3002:3002 --add-host=host.docker.internal:host-gateway \
		--name $(IMAGE_AUTH) \
		$(REPO_AUTH):$(TAG_AUTH)


# Connect inside the running container for debugging
shell:
	docker exec -it $(IMAGE)

# Generate the SSL/TLS config for HTTPS
gen-ssl:
	mkdir -p ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ssl/nginx.key -out ssl/nginx.crt

clean:
	docker rmi $(REPO):$(TAG)
	docker image prune -f