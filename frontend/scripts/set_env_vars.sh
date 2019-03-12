#!/bin/bash -x

if test -z $1 ; then 
    echo "The arg is empty. Setting production mode environment variables."
    BACKEND_HOST=backend.pushpong.xyz
    BACKEND_PORT=5000
    FRONTEND_HOST=pushpong.xyz
    FRONTEND_PORT=3000
else 
    echo "The arg is not empty: $1"
fi