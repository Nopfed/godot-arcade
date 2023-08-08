# Godot Arcade

Front-end app for publishing, browsing and uploading HTML5 games made in Godot Engine.

https://godot-arcade.g8way.io/

## Inspiration

I've been interested in publishing games to Arweave and I also like to make games in my free time, so I thought it would be cool to have a similar platform to itch.io, but hosted on Arweave.

## What it does

Allows users to browse, play and upload HTML5 games made in Godot. It uploads all game files with a manifest, and uses the manifest to grab all the files back when playing back the game in the browser.

While uploading a game it also allows you to optionally choose to add the Universal Data License to the bundle when uploading, as well as some optional UDL Derivation tags.

## How I built it

Nuxt webserver with Vuejs for frontend app. Arweavejs and Arconnect for interfacing with arweave and wallet connection.

Uses arbundles and arweavejs to upload the files with a manifest file. Used bundles to upload because when exporting godot games as HTML5 it spits out a bunch of files that are all dependent on each other in order for the game to properly work in the browser, and making multiple transactions for each file seemed a bit annoying/silly (I also think bundles are cool). And I wasn't able to get bundling to work with Bundlr or Ardrive because they currently don't natively support using an Arconnect wallet with bundles.

## Challenges I ran into

Issues with uploading files as a bundle AND trying to do that with Arconnect. A lot of the helpful tools don't natively allow this for some reason.

Godot games that use GLES3 probably won't render properly due to issues with cross origin isolation and sharedarraybuffer headers, but might be able to get a fix for this in the future. The game I tested with successfully was made on Godot 3.4.4 and was made using GLES2 and is supported by WebGL 2.0, which most browsers support natively.

## Accomplishments that I'm proud of

Getting it to work.

## What I learned

How interfacing with Arweave works, more experience with vue and using vuetify.

## What's next for Godot Arcade

Add more features, cleanup layout, add ability to show box covers for games, etc. Lots of potential to be added imo.
