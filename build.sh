mkdir middle
babel ./src/ -d ./middle
yarn build
rm -rf ./middle/
npm publish .
git add -A
git commit -m "auto commit"
git push