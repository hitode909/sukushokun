#!/bin/sh
set -x

mkdir -p data/
rm data/*
docker run -i --rm --name puppeteer-chrome --cap-add=SYS_ADMIN --shm-size=1gb --volume `pwd`:/home/pptruser puppeteer-chrome-linux node capture.js $*
