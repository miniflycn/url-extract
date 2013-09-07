@Echo off
if not exist .\node_modules\blanket npm install blanket
mocha --require blanket -R html-cov > coverage.html