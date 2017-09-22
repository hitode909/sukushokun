#!/bin/sh
set -x

mkdir -p Downloads/
rm Downloads/*
docker run -i --rm -u 500:500 --name puppeteer-chrome --cap-add=SYS_ADMIN --shm-size=1gb --volume `pwd`:/home/pptruser puppeteer-chrome-linux node capture.js $*
