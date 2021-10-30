figma-vrt-cli
=============

A Visual Regression Testing library for Figma. 
#  Installation

`npm i figma-vrt-cli`

## Config

In the root of your project, create a `config.js` file:
```
modules.exports = {
  API_KEY: "YOUR FIGMA KEY",
  FILE_ID: "YOUR FIGMA FILE ID"
}
```

## How It Works

Similar to BackstopJS, figma-vrt will first scan your Figma file and create snapshots for each of your pages. These will be your 'baseline'.

```
npx figma-vrt snapshot
```

This will create a new data directory in the root of your project. Now that you have a baseline set, you can then go about your business in Figma, making changes, deleting colors, the whole shebang. When you're finished, you can take new snapshots:

```
npx figma-vrt snapshot -t
```

or 

```
npx snapshot --test
```

Finally you can run
```
npx figma-vrt diff
```

to compare the two versions. 

If there any visual regressions, a new file will be created inside the `/data/diff` directory.
