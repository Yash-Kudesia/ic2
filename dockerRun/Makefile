.PHONY: build run

# Default values for variables
REPO_S1  ?= localhost:5000/ic2_s1
TAG_S1   ?= latest
IMAGE_S1 ?= ic2_s1

REPO_S3  ?= localhost:5000/ic2_s3
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
ENV ?= 0

build: build_doctor build_auth build_W1 build_S1 build_S3 build_S2 build_C2

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

build_S2: ../server_service_creator/Makefile
	make -C ../server_service_creator build

build_C2: ../desktop_version/Makefile
	make -C ../desktop_version build

run: run_proxy run_sql  run_myadmin run_doctor run_auth run_S1 run_W1 run_S3

run_S1:
	docker run --privileged --rm  -d  \
		-p 3001:3001 \
		-e SYSTEMENV=$(ENV) \
		--net IC2 --ip 172.18.0.7 \
		--add-host=host.docker.internal:host-gateway \
		-v /etc/timezone:/etc/timezone:ro \
    	-v /etc/localtime:/etc/localtime:ro \
		--name $(IMAGE_S1) \
		$(REPO_S1):$(TAG_S1)


run_S2:
	npm ./server_service_creator/ start 
run_S3:
	docker run --privileged --rm -d   \
		-p 3003:3003 \
		-e SYSTEMENV=$(ENV) \
		--net IC2 --ip 172.18.0.9 \
		--add-host=host.docker.internal:host-gateway \
		-v /etc/timezone:/etc/timezone:ro \
    	-v /etc/localtime:/etc/localtime:ro \
		--name $(IMAGE_S3) \
		$(REPO_S3):$(TAG_S3)

run_proxy:
	docker run --privileged --rm -d	\
	-p 3010:8080 -p 3011:8081 \
	-e SYSTEMENV=$(ENV) \
	-v $(PWD)/test_network/ssl:/home/ssl \
	-v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
	--net IC2 --ip 172.18.0.10 \
	--add-host=host.docker.internal:host-gateway \
	--name proxy \
	localhost:5000/proxy:latest



run_sql:
	docker run --privileged --rm -d	\
	-p 3306:3306 -p 33060:33060 \
	-e SYSTEMENV=$(ENV) \
	-v /home/prince/db:/var/lib/mysql \
	-v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
	--net IC2 --ip 172.18.0.2 \
	-e PASSWORD="" \
	--add-host=host.docker.internal:host-gateway \
	--name db \
	localhost:5000/mysql:latest

run_myadmin:
	docker run --privileged --rm -d \
	-p 8080:80 \
	-e SYSTEMENV=$(ENV) \
	--net IC2 --ip 172.18.0.3 \
	-v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
	--add-host=host.docker.internal:host-gateway \
	--name phpadmin \
	--link db:db \
	phpmyadmin:latest

run_doctor:
	docker run --privileged --rm -d \
	-p 3004:3004  \
	-e SYSTEMENV=$(ENV) \
	--net IC2 --ip 172.18.0.4 \
	-v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
	--add-host=host.docker.internal:host-gateway \
	--name doctor \
	localhost:5000/ic2_docter:latest

run_auth:
	docker run --privileged --rm  -d	\
	-p 3005:3005  \
	-e SYSTEMENV=$(ENV) \
	--net IC2 --ip 172.18.0.5 \
	-v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
	--add-host=host.docker.internal:host-gateway \
	--name auth \
	localhost:5000/ic2_auth:latest

run_W1:
	docker run --privileged --rm -d \
		-p 3000:3000  \
		-e SYSTEMENV=$(ENV) \
		--net IC2 --ip 172.18.0.6 \
		--add-host=host.docker.internal:host-gateway \
		-v /etc/timezone:/etc/timezone:ro \
    	-v /etc/localtime:/etc/localtime:ro \
		--name ic2_portal \
		localhost:5000/ic2_portal:latest

run_S2: ../server_service_creator/Makefile
	make -C ../server_service_creator run

run_C2: ../desktop_version/Makefile
	make -C ../desktop_version run

auth: build_auth run_auth
doctor: build_doctor run_doctor
W1: build_W1 run_W1
S1: build_S1 run_S1
S3: build_S3 run_S3

C2: build_C2 run_C2

S2:build_S2 run_S2


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

stop:
	docker container rm -f doctor phpadmin db proxy ic2_S3 ic2_portal ic2_s1 ic2_s1 auth