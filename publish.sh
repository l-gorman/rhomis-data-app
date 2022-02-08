#!/bin/bash

CURRENTBRANCH=$(git branch --show-current)

if [ "$CURRENTBRANCH" == "main" ]
then 
    echo "Working in main branch" 
    OLDDOMAIN="TESTDOMAIN"
    NEWDOMAIN="api.l-gorman.com"
    sed -i -e 's/$OLDDOMAIN/$NEWDOMAIN/g' ./public/CNAME
    npm run build 
    npx gh-pages -d build -r https://github.com/l-gorman/rhomis-data-app
    sed -i -e 's/$NEWDOMAIN/$OLDDOMAIN/g' ./public/CNAME
fi

if [ "$CURRENTBRANCH" == "prod" ]
then 
    echo "Working in main branch"
    npm run build
    OLDDOMAIN="TESTDOMAIN"
    NEWDOMAIN="api.rhomis.cgiar.org"
    sed -i -e 's/$OLDDOMAIN/$NEWDOMAIN/g' ./public/CNAME
    npx gh-pages -d build --repo https://github.com/ilri/rhomis-data-app
    sed -i -e 's/$NEWDOMAIN/$OLDDOMAIN/g' ./public/CNAME
fi

