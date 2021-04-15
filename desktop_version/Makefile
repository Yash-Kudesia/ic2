.PHONY: build run

# Default values for variables
REPO  ?= localhost:5000/ic2_client
TAG   ?= latest
IMAGE ?= ic2_client
PORT ?= 3006

build_C2:
	docker build -t $(REPO):$(TAG) .
	docker push $(REPO):$(TAG)

run_C2:
	docker run --privileged --rm -d   \
		-p $(PORT):$(PORT)  \
		--name $(IMAGE) \
		$(REPO):$(TAG)

all: build run

build:
	npm install

run : 
	npm start


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