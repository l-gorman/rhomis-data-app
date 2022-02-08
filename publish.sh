#!/bin/bash

CURRENTBRANCH=$(git branch --show-current)

if [ "$CURRENTBRANCH" == "main" ]
then 
    echo "Working in main branch" 
    file_contents=$(<./public/CNAME)
    echo "${file_contents//'TESTDOMAIN'/'app.l-gorman.com'}" > ./public/CNAME
    npm run build 
    npx gh-pages -d build -r https://github.com/l-gorman/rhomis-data-app
    echo "$file_contents" > ./public/CNAME
fi

if [ "$CURRENTBRANCH" == "prod" ]
then 
    echo "Working in main branch"
    npm run build
    file_contents=$(<./public/CNAME)
    echo "${file_contents//'TESTDOMAIN'/'rhomis.cgiar.org'}" > ./public/CNAME
    npx gh-pages -d build --repo https://github.com/ilri/rhomis-data-app
    echo "$file_contents" > ./public/CNAME
fi

