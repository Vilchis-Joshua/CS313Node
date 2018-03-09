#!/bin/bash

git add .
read answer
git commit -m "${answer}"
git push github master 
git push heroku master
clear