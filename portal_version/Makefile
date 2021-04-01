.PHONY: build run

# Default values for variables
REPO  ?= localhost:5000/ic2_portal
TAG   ?= latest

build:
	docker build -t $(REPO):$(TAG) .
	docker push $(REPO):$(TAG)

run:
	docker run --privileged --rm -d  \
		-p 3001:8080 --ip 172.17.0.5  \
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