run:
	docker run --privileged --rm  --name proxy_test \
	-p 3011:8080/tcp -p 3010:3010 \
	-v $(PWD):/usr/src/app/ \
	localhost:5000/proxy:test
# -v $(PWD)/test/config.json:/docker-entrypoint.d/config.json \
gen-ssl:
	mkdir -p ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ssl/nginx.key -out ssl/nginx.crt
		openssl genrsa -des3 -passout file:mypass.enc -out private/intermediate.cakey.pem 4096
		openssl req -new -sha256 -config intermediate/openssl.cnf -passin file:mypass.enc  -key private/intermediate.cakey.pem -out csr/intermediate.csr.pem


# sudo curl -X PUT -d '{ "pass": "applications/blogs" }' --unix-socket /path/to/control.unit.sock  http://localhost/config/listeners/127.0.0.1:8444
# sudo curl -X PUT -d '"applications/blogs"' --unix-socket /path/to/control.unit.sock \
#        http://localhost/config/listeners/127.0.0.1:8300/pass


# docker run --name dns -d --restart=always \
#   --publish 53:53/tcp --publish 53:53/udp --publish 10000:10000/tcp \
#   localhost:5000/dns:latest

# https://www.nginx.com/blog/nginx-unit-1-5-available-now/#ssl-tls-and-certificates  

curl -X  --unix-socket /run/control.unit.sock http://localhost/config/
curl --unix-socket /path/to/control.unit.sock 'http://localhost/config/'