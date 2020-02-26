# Spud Game Engine

Welcome to the Spud Game Engine git repository!

The Spud Game Engine plans to be a highly modular (and highly integrated) game
engine that fixes these problems that I always seem to encounter in JavaScript
game engines:

* Small size. You only need to download the parts that you will use.
* High preformance. I've made plenty of Indie JavaScript games _with_ and
_without_ engines, and the ones _without_ usually are 5 times more preformant.
I'd also like to point out that with all of these games, I started by making a
small game engine in the first place anyway.
* Contain often-used functionality. I find that some game engines just _don't._
That is to say, some feature, such as animations, just _can't_ be done without
making your own implimentation of it.
* Sensible defaults, on a per-genre basis. Generally speaking, 2d platformers
will always use non-snapping grid-collsion, and Pinball games will use a full
physics emulation. I can list examples all day but I think you get the idea.
* Deployability choice. I want to avoid limiting the developer's choice of how
to deploy as much as possible. They should be able to use any "server" they
wish, and choose whatever version of JS to compile to that they wish.

This repo seeks to host all of the tools (but not the assets) one would need
for a basic game.

