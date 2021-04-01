.PHONY: build run

# Default values for variables
REPO  ?= localhost:5000/ic2_lvd
TAG   ?= latest
# you can choose other base image versions
IMAGE ?= localhost:5000/ubuntu:20.04
# IMAGE ?= nvidia/cuda:10.1-cudnn7-devel-ubuntu18.04
# choose from supported flavors (see available ones in ./flavors/*.yml)
FLAVOR ?= lxde
# armhf or amd64
ARCH ?= amd64

# These files will be generated from teh Jinja templates (.j2 sources)
templates = Dockerfile rootfs/etc/supervisor/conf.d/supervisord.conf

# Rebuild the container image
build: $(templates)
	docker build -t $(REPO):$(TAG) .
	docker push $(REPO):$(TAG)

# Test run the container
# the local dir will be mounted under /src read-only
# run:
# 	docker run --privileged --rm \
# 		-p 6080:80 -p 6082:443 \
# 		-v ${PWD}:/src:ro \
# 		-e USER=gpy -e PASSWORD=gpy \
# 		-e ALSADEV=hw:2,0 \
# 		-e SSL_PORT=443 \
# 		-e RELATIVE_URL_ROOT=approot \
# 		-e OPENBOX_ARGS="--startup /usr/bin/galculator" \
# 		-v ${PWD}/ssl:/etc/nginx/ssl \
# 		--device /dev/snd \
# 		--name ubuntu-desktop-lxde-test \
# 		localhost:5000/ic2_def :latest
run:
	docker run --privileged --rm \
		-p 6080:80 -p 6082:443 \
		-e USER=ic2 -e PASSWORD=ic2 \
		-e SSL_PORT=443 \
		-v ${PWD}/ssl:/etc/nginx/ssl \
		--name ic2_1 \
		localhost:5000/ic2_lvd:latest


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

# Run jinja2cli to parse Jinja template applying rules defined in the flavors definitions
%: %.j2 flavors/$(FLAVOR).yml
	docker run -v $(shell pwd):/data vikingco/jinja2cli \
		-D flavor=$(FLAVOR) \
		-D image=$(IMAGE) \
		-D localbuild=$(LOCALBUILD) \
		-D arch=$(ARCH) \
		$< flavors/$(FLAVOR).yml > $@ || rm $@
