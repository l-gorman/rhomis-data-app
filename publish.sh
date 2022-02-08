#!/bin/bash

CURRENTBRANCH=$(git branch --show-current)

if [ "$CURRENTBRANCH" == "main" ]
then 
    echo "Working in staging branch (main)" 
    # Read in the contents of CNAME
    file_contents=$(<./public/CNAME)
    # Substitute "TESTDOMAIN" with the staging url
    echo "${file_contents//'TESTDOMAIN'/'app.l-gorman.com'}" > ./public/CNAME
    # Build the app
    npm run build 
    # Deploy using github pages app
    npx gh-pages -d build -r https://github.com/l-gorman/rhomis-data-app
    # Restore the CNAME file
    echo "$file_contents" > ./public/CNAME
fi

if [ "$CURRENTBRANCH" == "prod" ]
then 
    echo "Working in staging branch"
    # Reading in the contents of CNAME
    file_contents=$(<./public/CNAME)
    # Replacing domains
    echo "${file_contents//'TESTDOMAIN'/'rhomis.cgiar.org'}" > ./public/CNAME
    # Building the app
    npm run build
    # Deploy to ILRI repo
    npx gh-pages -d build --repo https://github.com/ilri/rhomis-data-app
    # Restore th contents to original
    echo "$file_contents" > ./public/CNAME
fi

