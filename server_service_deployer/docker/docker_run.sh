#!/bin/sh
#Test run the container
# Sample Command
#  ./docker_run.sh ic2 ic2 localhost:5000/ic2_lvd:latest approot /usr/bin/firefox   test 6080 6082

# user = $1;
# pass = $2;
# image = $3;
# approot = $4;
# openbox_args= $5;
# #dir = $6;
# name = $7;
# port1= $8;
# port2 = $9;
# if [user == "" && pass == ""]; then
#     user = ic2;
#     pass = ic2;
# fi


exec `docker run --privileged --rm -d \
        -p $7:80 -p $8:443 \
		-e USER=$1 -e PASSWORD=$2 \
		-e ALSADEV=hw:2,0 \
		-e SSL_PORT=443 \
		-e RELATIVE_URL_ROOT=$4 \
		-e OPENBOX_ARGS="--startup $5" \
		--device /dev/snd \
		--name $6 \
		$3`

exec `docker run --privileged --rm -d -p 6080:80 -p 6082:443 -e USER=ic2 -e PASSWORD=ic2 -e ALSADEV=hw:2,0 -e SSL_PORT=443 -e RELATIVE_URL_ROOT=approot -e OPENBOX_ARGS="--startup /usr/bin/firefox" --device /dev/snd --name test localhost:5000/ic2_lvd:latest`

