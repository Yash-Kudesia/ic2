.PHONY: build run

# Default values for variables
REPO  ?= localhost:5000/ic2_docter
TAG   ?= latest
IMAGE ?= ic2_docter
PORT ?= 3003

build:
	docker build -t $(REPO):$(TAG) .
	docker push $(REPO):$(TAG)

run:
	docker run --privileged --rm -d   \
		-p $(PORT):8080  \
		--name $(IMAGE) \
		$(REPO):$(TAG)


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