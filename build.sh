mkdir middle
babel ./src/ -d ./middle
rollup -c ./build/rollup.config.js
rm -rf ./middle/
npm publish .
git add -A
git commit -m "auto commit"
git push origin master
