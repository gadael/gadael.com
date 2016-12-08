#!/bin/bash

hexo clean
my_dir=`dirname $0`
$my_dir/addDocVersions.sh master

hexo generate
