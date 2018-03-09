#!/bin/bash

git add .
read answer
git commit -m "${answer}"
git push
git push heroku master
clear