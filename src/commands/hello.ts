import { Command, flags } from "@oclif/command";
import { Client } from "../client";
const fs = require("fs");
const https = require("https"); // or 'https' for https:// URLs

import cli from "cli-ux";

export default class Hello extends Command {
  client: any;

  static description = "describe the command here";

  static examples = [
    `$ figma-vrt hello
hello world from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    const client = new Client();
    const { args, flags } = this.parse(Hello);
    let mode = "base";
    if (args.file) {
      mode = args.file
    }

    const dir = `data/${mode}`

    cli.action.start("Fetching pages");

    const pages = await client.getPages();
    cli.action.stop(`Found ${pages.length} pages`); // shows 'starting a process... done'

    cli.action.start("Fetching Pngs");
    const ids = pages.map((page: any) => {
      return page.id
    })
    const images = await client.getNodeAsPng(ids);
    cli.action.stop("Pages Got");

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }

    for (const image in images) {
      if (images[image]) {
        const file = fs.createWriteStream(`data/${mode}/${image}.png`);
        const request = https.get(`${images[image]}`, function (response: any) {
          response.pipe(file);
        });
      }
    }

    const name = flags.name ?? "world";
    this.log(`hello ${name} from ./src/commands/hello.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
