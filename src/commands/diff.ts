import { Command, flags } from "@oclif/command";
const path = require("path");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");
const fs = require("fs");

export default class Diff extends Command {
  static description = "describe the command here";

  static examples = [
    `$ figma-vrt diff
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
    const { args, flags } = this.parse(Diff);
    const diffDir = `data/diff`

    if (!fs.existsSync(diffDir)){
      fs.mkdirSync(diffDir, { recursive: true });
    }

    const name = flags.name ?? "world";

    //passsing directoryPath and callback function
    fs.readdir("data/base", function (err: any, files: any) {
      //handling error
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      //listing all files using forEach
      files.forEach(function (file: any) {
        console.log("file", file);
        const img1 = PNG.sync.read(fs.readFileSync(`data/base/${file}`));
        const img2 = PNG.sync.read(fs.readFileSync(`data/test/${file}`));

        if (img1 && img2) {
          const { width, height } = img1;
          const diff = new PNG({ width, height });

          const res = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            width,
            height,
            {
              threshold: 0.1,
            }
          );
          console.log("res", res);
          if (res > 0) {
            fs.writeFileSync(`data/diff/${file}`, PNG.sync.write(diff));
          }
        }

        // Do whatever you want to do with the file
        // console.log(file);
      });
    });

    this.log(`hello ${name} from ./src/commands/hello.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
