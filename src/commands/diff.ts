import { Command, flags } from "@oclif/command";
const path = require("path");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");
const fs = require("fs");
import { Listr } from "listr2";
import { Logger } from "listr2";

interface Ctx {
  skip: boolean;
}

const logger = new Logger({ useIcons: false });
export default class Diff extends Command {
  static description = "describe the command here";

  static examples = [
    `$ figma-vrt diff
hello world from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
  };


  async run() {
    const diffDir = `data/diff`;

    if (!fs.existsSync(diffDir)) {
      fs.mkdirSync(diffDir, { recursive: true });
    }

    //passsing directoryPath and callback function
    await fs.readdir("data/baseline", async (err: any, files: any) => {
      //handling error
      if (err) {
        throw new Error('Unable to scan directory')
      }

      let task: Listr<Ctx>;

      const tasks: any[] = [];

      //listing all files using forEach
      files.forEach(function (file: any) {
        const task = {
          title: file,
          task: async (): Promise<void> => {
            const img1 = PNG.sync.read(
              fs.readFileSync(`data/baseline/${file}`)
            );
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
              if (res > 0) {
                fs.writeFileSync(`data/diff/${file}`, PNG.sync.write(diff));
                throw new Error(`[FAILED] ${file}`);
              }
            }
          },
        };
        tasks.push(task);


      });


      task = new Listr<Ctx>(tasks, { concurrent: false, exitOnError: false });

      try {
        const context = await task.run();
        this.log('Tests completed!')
      } catch (e) {
        logger.fail(e);
      }
    });

  }
}
