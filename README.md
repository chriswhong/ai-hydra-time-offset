# ai-hydra-time-offset

Node.js script for shifting the light schedule for an AquaIllumination Hydra26 Aquarium Light by a specified number of minutes

## How to Use

Clone this repository

Install Dependencies `cd ai-hydra-time-offset && npm install`

Run the script `node time-offset.js {minutes to offset} {path-to-original-aip-file} {path-to-output-aip-file}`

## Sample Program

This repo contains a sample `.aip` file in `data/original.aip`.  To shift all of the times in this file by -180 minutes, run `node time-offset.js -180 data/original.aip data/output.aip`
