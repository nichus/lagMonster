#!bash

docker run -d --restart unless-stopped --mount src="$(pwd)/data",target=/usr/src/lagMonster/data,type=bind lag
