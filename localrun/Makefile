.PHONY: build run

# Default values for variables
REPO_S1  ?= localhost:5000/ic2_s1
TAG_S1   ?= latest
IMAGE_S1 ?= ic2_s1

REPO_S3  ?= localhost:5000/ic2_docter
TAG_S3   ?= latest
IMAGE_S3 ?= ic2_S3

REPO_AUTH  ?= localhost:5000/ic2_auth
TAG_AUTH   ?= latest
IMAGE_AUTH ?= ic2_auth

REPO_DOCTOR  ?= localhost:5000/ic2_docter
TAG_DOCTOR   ?= latest
IMAGE_DOCTOR ?= ic2_docter

REPO_W1  ?= localhost:5000/ic2_portal
IMAGE_W1 ?= ic2_portal
TAG_W1   ?= latest


#ENV for docker = 0 and local = 1
ENV ?= 1
build: build_doctor build_auth build_W1 build_S1 build_S3

build_doctor:
	docker build -t $(REPO_DOCTOR):$(TAG_DOCTOR) ../doctor
	docker push $(REPO_DOCTOR):$(TAG_DOCTOR)

build_auth:
	docker build -t $(REPO_AUTH):$(TAG_AUTH) ../server_auth
	docker push $(REPO_AUTH):$(TAG_AUTH)

build_W1:
	docker build -t $(REPO_W1):$(TAG_W1) ../portal_version
	docker push $(REPO_W1):$(TAG_W1)

build_S1:
	docker build -t $(REPO_S1):$(TAG_S1) ../server_request_handler
	docker push $(REPO_S1):$(TAG_S1)
build_S3:
	docker build -t $(REPO_S3):$(TAG_S3) ../server_service_deployer
	docker push $(REPO_S3):$(TAG_S3)

run: run_proxy run_sql  run_myadmin run_doctor run_auth run_S1 run_W1 run_S3

run_S1:
	docker run --privileged --rm   -d \
		--net host  \
		-p 3001:3001 \
		-expose=3001 \
		-e SYSTEMENV=$(ENV) \
		-v /etc/timezone:/etc/timezone:ro \
    	-v /etc/localtime:/etc/localtime:ro \
		--name $(IMAGE_S1) \
		$(REPO_S1):$(TAG_S1)


run_S2:
	node ../server_service_creator/server.js

run_S3:
	docker run --privileged --rm -d   \
		-e SYSTEMENV=$(ENV) \
		-p 3003:3003 \
		-expose=3003 \
		-v /etc/timezone:/etc/timezone:ro \
    	-v /etc/localtime:/etc/localtime:ro \
		--net host \
		--name $(IMAGE_S3) \
		$(REPO_S3):$(TAG_S3)

run_proxy:
	docker run --privileged --rm -d	\
	-p 3009:3009 -p 3010:3010 \
	-e SYSTEMENV=$(ENV) \
	-expose=3009-3010 \
	-v /home/prince/ic2/ic2/test_network/ssl:/home/ssl \
	-v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
	--net host \
	--name proxy \
	localhost:5000/proxy:latest



run_sql:
	docker run --privileged --rm -d	\
	-e SYSTEMENV=$(ENV) \
	-p 3306:3306 -p 3306:3306
	-expose=3306 \
	-expose=33060 \
	-v /home/prince/db:/var/lib/mysql \
	-v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
	--net host \
	-e PASSWORD="" \
	--name db \
	localhost:5000/mysql:latest

run_myadmin:
	docker run --privileged --rm -d \
	--net host -p 8080:8080 \
	-expose=8080 \
	-e SYSTEMENV=$(ENV) \
	-v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
	--name phpadmin \
	phpmyadmin:latest

run_doctor:
	docker run --privileged --rm  -d \
	--net host \
	-p 3004:3004 \
	-expose=3004 \
	-e SYSTEMENV=$(ENV) \
	-v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
	--name doctor \
	localhost:5000/ic2_docter:latest

run_auth:
	docker run --privileged --rm  -d	\
	--net host \
	-p 3005:3005 \
	-expose=3005 \
	-e SYSTEMENV=$(ENV) \
	-v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
	--name auth \
	localhost:5000/ic2_auth:latest

run_W1:
	docker run --privileged --rm  -d  \
		--net host \
		-expose=3000 \
		-e SYSTEMENV=$(ENV) \
		-v /etc/timezone:/etc/timezone:ro \
    	-v /etc/localtime:/etc/localtime:ro \
		--name ic2_portal \
		localhost:5000/ic2_portal:latest


auth: build_auth run_auth
doctor: build_doctor run_doctor
W1: build_W1 run_W1
S1: build_S1 run_S1
S3: build_S3 run_S3





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