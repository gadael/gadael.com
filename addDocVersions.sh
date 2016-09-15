#!/bin/bash

# Create a documentation folder for one language and one tag
# The new folder will be named "version-TAG"
#
# $1 - git tag name or "master" for lastest version
# $2 - Language code
#
createTagForLang()
{
    source="docs/${2}"
    target="../source/${2}/docs/version-${1}"
    if [ -d "${target}" ]
    then
        rm -Rf "${target}"
    fi

    if [ -d "${source}" ]
    then
        mkdir "${target}"
        cp -Lr "${source}"/* "${target}"
    fi

}

git clone https://github.com/gadael/gadael-documentation
cd gadael-documentation/ || exit



for tag in "$@"
do
    git checkout ${tag} || exit
    createTagForLang ${tag} 'en'
    createTagForLang ${tag} 'fr'
done

cd ..
rm -Rf gadael-documentation
