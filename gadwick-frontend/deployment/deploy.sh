#!/bin/bash

if [ $1 == "local" ] || [ $1 == "dev" ] || [ $1 == "prod" ]
    then
        echo "copying in" $1 "deployment file"
        cp deployment/configs/$1.json src/config.json
else
    echo $1 "is not a valid deployment environment";
    exit 1;
fi
if [ $1 == "dev" ] || [ $1 == "prod" ]
    then
        sls deploy --stage $1
fi