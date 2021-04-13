.PHONY: build run

# Default values for variables
REPO_S1  ?= localhost:5000/ic2_s1
TAG_S1   ?= latest
IMAGE_S1 ?= ic2_s1

build:
	docker build -t $(REPO_S1):$(TAG_S1) .
	docker push $(REPO_S1):$(TAG_S1)

run:
	docker run --privileged --rm  -d  \
		-p 3002:3002 \
		--ip 172.18.0.7 \
		--add-host=host.docker.internal:host-gateway \
		--name $(IMAGE_S1) \
		$(REPO_S1):$(TAG_S1)


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