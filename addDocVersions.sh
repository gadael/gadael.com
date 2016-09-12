#!/bin/bash

createTagForLang()
{
    target="../source/${2}/docs/version-${1}"
    if [ -d "${target}" ]
    then
        rm -Rf "${target}"
    fi
    mkdir "${target}"
    cp -R docs/"${2}"/* "${target}"
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
