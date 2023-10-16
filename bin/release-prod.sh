#!/bin/bash

cd `dirname $0` #set the working directory to /bin
cd ..           #back to project root

if [ -z "$(git status --porcelain)" ]; then
  # Working directory clean
  yarn bump-version

  PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",\t ]//g')

  RELEASE_TAG=$(echo v${PACKAGE_VERSION}_prod)

  git commit -a -m "Release $RELEASE_TAG" && git tag $RELEASE_TAG && git push && git push --tags
else
  # Uncommitted changes
  echo "You have uncommitted changes. Code must be pushed for GitHub actions to deploy."
  exit 0
fi
