#!/bin/bash
echo "Creating a new release"
npm ci
package_version=$(cat package.json | jq -r '.version')
echo "publish to npm"
npm publish
# tag on github
echo "create tag ${package_version}"
git tag -a $package_version -m "Release of version $package_version"
git push --tags
# done
echo "Done!"
