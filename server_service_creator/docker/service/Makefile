.PHONY: build run
PORT=<value> PORT1=<value> make run 

serviceID?= 1 
# Default values for variables
REPO  ?= localhost:5000/ic2_lvd/
TAG   ?= latest

IMAGE ?= $(REPO):$(TAG)
PORT ? = 6080
PORT1 ?= 6082
USER ?= ic2
PASSWORD ?= ic2

run:
	docker pull $(IMAGE)
	docker run --privileged --rm -d \
		-p $(PORT):80 -p $(PORT1):443 \
		-e USER=ic2 -e PASSWORD=ic2 \
		-e SSL_PORT=443 \
		-v ${PWD}/ssl:/etc/nginx/ssl \
		--name ic2_$(serviceID) \
		$(IMAGE)


# Connect inside the running container for debugging
shell:
	docker exec -it ubuntu-desktop-lxde-test bash

# Generate the SSL/TLS config for HTTPS
gen-ssl:
	mkdir -p ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ssl/nginx.key -out ssl/nginx.crt

clean:
	rm -f $(templates)

extra-clean:
	docker rmi $(REPO):$(TAG)
	docker image prune -f