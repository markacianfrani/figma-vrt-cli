const axios = require('axios')

const API_KEY = "yeah right buddy";
const FILE_ID = "";

export class Client {
  client: any;

  constructor() {
    this.client = axios.create({
      baseURL: `https://api.figma.com/v1/`,
      headers: { "X-Figma-Token": API_KEY },
    });
  }


  async getNode(nodeId: string) {
    return this.client
      .get(`files/${FILE_ID}/nodes?ids=${nodeId}`, {
        //   responseType: 'stream'
      })
      .then((r: any) => {
        return r.data
      })
      .catch((e: any) => {
        console.log(e.message);
      });
  }

  async getPages() {
    return this.client.get(`files/${FILE_ID}?depth=1`)
    .then((r: any) => {
      return r.data.document.children
    })
    .catch((e: any) => {
      console.log(e.message);
    })
  }

  async getNodeAsPng(nodeId: string | [] ) {
    return this.client(`images/${FILE_ID}?ids=${nodeId}&format=png`)
    .then((r: any) => {
      return r.data.images
    })
    .catch((e: any) => console.log(e.message))
  }
}
