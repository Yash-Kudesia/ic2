.PHONY: build run

# Default values for variables
REPO_DOCTOR  ?= localhost:5000/ic2_docter
TAG_DOCTOR   ?= latest
IMAGE_DOCTOR ?= ic2_docter

build:
	docker build -t $(REPO_DOCTOR):$(TAG_DOCTOR) .
	docker push $(REPO_DOCTOR):$(TAG_DOCTOR)

run:
	docker run --privileged --rm -d   \
		-p 3005:8080 --ip 172.17.0.6 \
		--name $(IMAGE_DOCTOR) \
		$(REPO_DOCTOR):$(TAG_DOCTOR


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