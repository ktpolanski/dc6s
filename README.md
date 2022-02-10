# DC6S

One day this will be a bespoke CS script. For now it's just noodling up parts of the requisite infrastructure in as simple a syntax as I can muster.

## Setup

If you don't have `yarn`, install [node.js](https://nodejs.org/en/), open a terminal and write `npm install -g yarn`. Once done, perform the following:

```
git clone https://github.com/ktpolanski/dc6s
cd dc6s && yarn install && yarn run build
ln -s $PWD/KoLmafia/scripts/dc6s/ ~/Library/Application\ Support/KoLmafia/scripts/
ln -s $PWD/KoLmafia/ccs/dc6s.ccs ~/Library/Application\ Support/KoLmafia/ccs/
```

This repo was splintered from docrostov's [TS starter repository](https://github.com/docrostov/kol-ts-starter) due to the author's lack of TS chops.
