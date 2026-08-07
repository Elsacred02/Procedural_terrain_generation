# Game design seminar - generation of procedural terrains for videogames

One of the most important aspects of video game development concerns the procedural generation of game worlds, because it allows the player to have a different experience in every playthrough, ensuring a high level of replayability.
This project explores and implements several techniques used in the field of procedural terrain generation, such as Perlin noise, Poisson
disk sampling, and wave function collapse. Each algorithm has specific functions; in particular, the first technique is used to model the terrain, while the second and third are dedicated to placing assets (trees, rocks, houses) with the aim of shaping the environment. The combination of all these methodologies enables the creation of a full-fledged procedural generation pipeline; this pipeline was implemented using the Three.js graphics library and by applying programming techniques for separation of concerns, with the goal of making each aspect of the procedure modular.

## Guide for installation and run

First, you need to install [node](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), then clone or download the project.

Open the folder using your preferred terminal and run the following commands:

```
npm install
npm run dev
```