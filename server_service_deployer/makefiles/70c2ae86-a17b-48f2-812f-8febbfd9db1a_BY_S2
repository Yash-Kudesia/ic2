.PHONY: build run

# Default values for variables
REPO  ?= localhost:5000/ic2_s2
TAG   ?= latest
IMAGE ?= ic2_s2
PORT ?= 3002

build_S2:
	docker build -t $(REPO):$(TAG) .
	docker push $(REPO):$(TAG)

run_S2:
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

generate_makeFile:
	echo "run:\n\t docker run --privileged --rm -d  \n\t -p 6083:80 -p 6084:443 \n\t-e USER=userName -e PASSWORD=ic2 \n\t--name ic2_2 \n\t localhost:5000/ic2_lvd:latest" > /tmp/_MakeFile