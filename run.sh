#!/bin/sh
set -x

mkdir -p Downloads/
rm Downloads/*
docker run -i --rm --name sukushokun --cap-add=SYS_ADMIN --shm-size=1gb --volume `pwd`:/home/pptruser sukushokun node capture.js $*
