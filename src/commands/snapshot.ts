import { Command, flags } from "@oclif/command";
import { Client } from "../client";
const fs = require("fs-extra");
const https = require("https"); // or 'https' for https:// URLs

import cli from "cli-ux";

export default class Snapshot extends Command {
  client: any;

  static description = "snapshot pages from figma";

  static examples = [
    `$ figma-vrt snapshot
    `,
  ];

  static flags = {
    test: flags.boolean({ char: "t", description: "record snapshots to your /test directory"}),
    baseline: flags.boolean({ char: "b", description: "record snapshots to your /baseline directory"}),
    help: flags.help({ char: "h" }),
  };

  async run() {
    const { args, flags } = this.parse(Snapshot);
    const configFilePath = `${process.cwd()}/config.js`

    if (!fs.existsSync(configFilePath)) {
      throw new Error ('missing config file')

    }
    const config = require(configFilePath)
    const client = new Client(config.API_KEY, config.FILE_ID);

    let mode = "baseline";
    if (flags.test) {
      mode = "test"
    }

    const dir = `${process.cwd()}/data/${mode}`;

    this.log(`Fetching ${mode} snapshots.`)
    cli.action.start("Fetching pages");

    const pages = await client.getPages();
    cli.action.stop(`Found ${pages.length} pages`); // shows 'starting a process... done'

    cli.action.start("Fetching Pngs");
    let pageNames = pages.reduce((ac: any, a: any) => {
      return { ...ac, [a.id]: a.name };
    }, {});


    const ids = Object.keys(pageNames)

    const images = await client.getNodeAsPng(ids);

    cli.action.stop("Pages Got");

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.emptyDirSync(dir)
    // await fs.remove(dir)

    for (const image in images) {
      if (images[image]) {
        const pageName = pageNames[image].replace(/ /g,'-').toLowerCase();

        const file = fs.createWriteStream(`${dir}/${pageName}.png`);
        https.get(`${images[image]}`, function (response: any) {
          response.pipe(file);
        });
      }
    }

    this.log('Snapshots saved!')
  }
}
