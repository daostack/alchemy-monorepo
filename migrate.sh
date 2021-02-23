git remote add -f ${1} https://github.com/daostack/${1}.git
git merge -s ours --no-commit ${1}/master --allow-unrelated-histories
git read-tree --prefix=packages/${1} -u ${1}/master:
