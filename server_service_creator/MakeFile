
# Default values for variables
SERVICEID ?= 12
Registry ?=localhost:5000
REPO  ?= $(Registry)/$(SERVICEID)
TAG   ?= latest
IMAGE ?= $(Registry)/$(TAG)
FLAVOR ?= lxde
ARCH ?= amd64
USERNAME ?= ic2
DIR ?= /tmp/$(SERVICEID)
NAME ?= $(serviceID)
PORT ?= 6080
PORT1 ?= 6082

run:
	docker run --privileged --rm -d  \
		-p PORT:80 -p PORT1:443 \
		-e USER=$(USERNAME) -e PASSWORD=ic2 \
		--name $(NAME) \
		$(IMAGE)



