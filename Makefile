# this is our publishing contract

install:
	npm ci

update:
	npm run data

build:
	npm run build

preprod:
	./deploy.sh --preprod

publish:
	./deploy.sh --production


manual-publish:
	gulp data
	./deploy.sh
	./deploy.sh --production
