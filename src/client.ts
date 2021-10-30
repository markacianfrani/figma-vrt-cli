const axios = require('axios')

export class Client {
  client: any;
  fileId: string;

  constructor(apiKey: string, fileId: string) {
    this.client = axios.create({
      baseURL: `https://api.figma.com/v1/`,
      headers: { "X-Figma-Token": apiKey },
    });
    this.fileId = fileId


  }


  async getNode(nodeId: string) {
    return this.client
      .get(`files/${this.fileId}/nodes?ids=${nodeId}`, {
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
    return this.client.get(`files/${this.fileId}?depth=1`)
    .then((r: any) => {
      return r.data.document.children
    })
    .catch((e: any) => {
      console.log(e.message);
    })
  }

  async getNodeAsPng(nodeId: string | string[] ) {
    return this.client(`images/${this.fileId}?ids=${nodeId}&format=png`)
    .then((r: any) => {
      return r.data.images
    })
    .catch((e: any) => console.log(e.message))
  }
}
