set -e

npx vuepress build docs

cd docs/.vuepress/dist

git init
git add -A
git config user.name $GH_NAME
git config user.email $GH_EMAIL
git commit -m 'Deploy from CircleCI [ci skip]'

git push --force --quiet $CIRCLE_REPOSITORY_URL master:gh-pages

cd -
