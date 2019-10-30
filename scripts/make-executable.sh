#!/usr/bin/env bash

set -eux

declare -a files=(
  "dist/cli.js"
  "dist/commands/start/index.js"
  "dist/commands/init/index.js"
  "dist/commands/hook/index.js"
)

for i in "${files[@]}"
do
  chmod ug+x "$i"
done
