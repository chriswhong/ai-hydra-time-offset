# ai-hydra-time-offset

Node.js script for shifting the light schedule for an AquaIllumination Hydra26 Aquarium Light by a specified number of minutes

## How to Use

Clone this repository

Install Dependencies `cd ai-hydra-time-offset && npm install`

Run the script `node time-offset.js {minutes to offset} {path-to-original-aip-file} {path-to-output-aip-file}`

## Sample Program

This repo contains a sample `.aip` file in `data/original.aip` (This file is the ["signature series" David Saxby light settings from AI's website](http://www.aquaillumination.com/signature/)).  To shift all of the times in this file by -180 minutes, run `node time-offset.js -180 data/original.aip data/output.aip`.

This profile was the original inspiration for writing this script. The light sequence doesn't start until 10am and ends at 11pm.  I liked the settings, but wanted it to start 3 hours earlier, running from 7am to 8pm.

## How it works

The light settings are saved as `.aip` files, and they are just XML that you can open with any text editor.  For each of the colors you can adjust in the hydra26's Web interface or app, there is an xml element with `point` elements in it, each of these contains `intensity` and `time` elements.  (`time` is an integer, the number of minutes since midnight, or 0 thru 1440)

<img width="784" alt="Screen Shot 2019-05-21 at 11 27 08 PM" src="https://user-images.githubusercontent.com/1833820/58145762-5696d000-7c21-11e9-82bb-22a8d02e1533.png">

However, it's not as simple as just offsetting the time integers and saving the file, AI has added a checksum, and validates the `colors` element against the checksum.  If they don't match up, you'll get an error when trying to import the file via the hydra26 web UI.

<img width="1177" alt="Screen Shot 2019-05-21 at 11 15 32 PM" src="https://user-images.githubusercontent.com/1833820/58145764-58f92a00-7c21-11e9-871e-4776da0f8b5f.png">

Some hackers at [thereefuge.com reef forum](http://thereefuge.com/threads/reverse-engineering-a-hydra-26-hd.15524/) reverse engineered the frontend code that parses the `.aip` files and figured out how to calculate a checksum that the hydra will accept, which I've repurposed in this script.

So, this script parses the xml into json, offsets all of the time integers by the specified amount, calculates a checksum, then spits out a `.aip` file with new settings and a matching checksum that the Hydra26 will accept.

## Contact Me
If you have questions or feedback, the best way to reach me is [@chris_whong](https://twitter.com/chris_whong) on twitter.  Happy reef hacking!
