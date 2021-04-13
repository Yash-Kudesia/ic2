.PHONY: build run

# Default values for variables
REPO_S3  ?= localhost:5000/ic2_docter
TAG_S3   ?= latest
IMAGE_S3 ?= ic2_docter

build:
	docker build -t $(REPO_S3):$(TAG_S3) .
	docker push $(REPO_S3):$(TAG_S3)

run:
	docker run --privileged --rm -d   \
		-p 3005:8080  -p 3006:8082 --add-host=host.docker.internal:host-gateway\
		--name $(IMAGE_S3) \
		$(REPO_S3):$(TAG_S3)


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