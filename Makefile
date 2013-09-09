install:
	@npm install

test:
	@mocha

test-cov:
	@mocha --require blanket -R html-cov > coverage.html
	@echo Please open coverage.html to see the result!

.PHONY: test test-cov