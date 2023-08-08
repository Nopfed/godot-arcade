# Godot Arcade

Front-end app for publishing, browsing and uploading HTML5 games made in Godot Engine.

https://godot-arcade.g8way.io/

## Inspiration

I've been interested in publishing games to Arweave and I also like to make games in my free time, so I thought it would be cool to have a similar platform to itch.io, but hosted on Arweave.

## What it does

Allows users to browse, play and upload HTML5 games made in Godot. It uploads all game files with a manifest, and uses the manifest to grab all the files back when playing back the game in the browser.

## How I built it

Nuxt webserver with Vuejs for frontend app. Arweavejs and Arconnect for interfacing with arweave and wallet connection.

## Challenges I ran into

Issues with uploading files as a bundle AND trying to do that with Arconnect. A lot of the helpful tools don't natively allow this for some reason

## Accomplishments that I'm proud of

Getting it to work.

## What I learned

How interfacing with Arweave works, more experience with vue and using vuetify.

## What's next for Godot Arcade

Add more features, cleanup layout, add ability to show box covers for games, etc. Lots of potential to be added imo.
