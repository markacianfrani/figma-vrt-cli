figma-vrt-cli
=============

A Visual Regression Testing library for Figma. 
#  Installation
`npm i figma-vrt-cli`

## Config

Create a new config file
```
mv config.js.example config.js
```

In your config.js, enter your FIGMA API KEY and the FILE ID of your Figma file.

## How It Works

Similar to BackstopJS, figma-vrt will first scan your Figma file and create snapshots for each of your pages. These will be your 'baseline'.

```
npm run snapshot
```

Now that you have a baseline set, you can then go about your business in Figma, making changes, deleting colors, the whole shebang. When you're finished, you can take new snapshots:

```
npm run snapshot -t
```

or 

```
npm run snapshot --test
```

Finally you can run
```
npm run diff
```

to compare the two versions. 

If there any visual regressions, a new file will be created inside the `/data/diff` directory. 
