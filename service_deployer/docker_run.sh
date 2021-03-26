#!/bin/sh
#Test run the container
# Sample Command
#  ./docker_run.sh ic2 ic2 localhost:5000/desk1:test approot /usr/bin/firefox  . test 6080 6082

user = $1;
pass = $2;
image = $3;
approot = $4;
openbox_args= $5;
dir = $6;
name = $7;
port1= $8;
port2 = $9;
if [user == "" && pass == ""]
    user = ic2;
    pass = ic2;
fi


exec `docker run --privileged --rm -d \
        -p $port:80 -p $port1:443 \
		-v $dir:/src:ro \
		-e USER=$user -e PASSWORD=$pass \
		-e ALSADEV=hw:2,0 \
		-e SSL_PORT=443 \
		-e RELATIVE_URL_ROOT=$approot \
		-e OPENBOX_ARGS="--startup $openbox_args" \
		--device /dev/snd \
		--name $name \
		$image`

