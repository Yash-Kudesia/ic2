.PHONY: build run

# Default values for variables
REPO_W1  ?= localhost:5000/ic2_portal
IMAGE_W1 ?= ic2_portal
TAG_W1   ?= latest

build:
	docker build -t $(REPO_W1):$(TAG_W1) .
	docker push $(REPO_W1):$(TAG_W1)
#npm start --authDB=192.168.1.1 --doctorDB=192.168.1.2 --S1IP=192.168.1.3
run:
	docker run --privileged --rm -d  \
		-p 3000:3000   --add-host=host.docker.internal:host-gateway \
		--name ic2_portal \
		$(REPO):$(TAG)


# Connect inside the running container for debugging
shell:
	docker exec -it ic2_portal

# Generate the SSL/TLS config for HTTPS
gen-ssl:
	mkdir -p ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ssl/nginx.key -out ssl/nginx.crt

extra-clean:
	docker rmi $(REPO):$(TAG)
	docker image prune -f