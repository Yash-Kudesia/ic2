.PHONY: build run

# Default values for variables
registry ?=localhost:5000
serviceID ?= 12
repo  ?= $(registry)/$(serviceID)
tag   ?= latest
# you can choose other base image versions
base ?=ubuntu:20.04
_image ?= $(registry)/$(base)
_FLAVOR ?= lxde
_ARCH ?= amd64
userName?=ic2
password?=ic2

# These files will be generated from teh Jinja templates (.j2 sources)
templates = Dockerfile rootfs/etc/supervisor/conf.d/supervisord.conf

# Rebuild the container image
build: $(templates)
	docker build -t $(repo):$(tag) .
	docker push $(repo):$(tag)

run:
	docker run --privileged --rm -d  \
		-p 6083:80 -p 6084:443 \
		-e USER=userName -e PASSWORD=ic2 \
		-e SSL_PORT=443 \
		-v ${PWD}/ssl:/etc/nginx/ssl \
		--name ic2_2 \
		localhost:5000/ic2_lvd:latest

clean:
	rm -f $(templates)

# Run jinja2cli to parse Jinja template applying rules defined in the flavors definitions
%: %.j2 flavors/$(_FLAVOR).yml
	docker run -v $(shell pwd):/data vikingco/jinja2cli \
		-D flavor=$(_FLAVOR) \
		-D image=$(_image) \
		-D localbuild=$(LOCALBUILD) \
		-D arch=$(_ARCH) \
		$< flavors/$(_FLAVOR).yml > $@ || rm $@


