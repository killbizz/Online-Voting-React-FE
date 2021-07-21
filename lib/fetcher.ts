export default class Fetcher {
  url: URL;

  constructor(funName: string) {
    this.url = new URL(
      `http://localhost:8080/${funName}`
    );
  }

  async getJSONResponse(method: string, params: string | null = null): Promise<any> {
    let token: string | null = null;
    let jwtToken: string | null = null;
    if (!!localStorage.getItem("jwtToken")){
      token = localStorage.getItem("jwtToken");
      jwtToken = "Bearer " + token;
    }
    let header: HeadersInit | undefined = {
      "Content-Type": "application/json"
    };
    // add JWT if present in the localstorage
    Object.assign(header, token !== null ? { "Authorization": jwtToken } : null);
    let req = null;
    if (method === "GET") {
      req = await fetch(this.url.href, {
        headers: {
          "Content-Type": "application/json",
        }
      });
    } else {
      req = await fetch(this.url.href, {
        body: params,
        headers: header,
        method,
      });
    }
    if(req.status === 404){
      return {
        error: "error 404, not found"
      }
    }
    if(req.status === 400){
      return {
        error: "error 400, bad request"
      }
    }
    if(req.status === 403){
      return {
        error: "error 403, forbidden"
      }
    }
    if(method === "DELETE" && req.status === 204){
      return {
        status: 204
      }
    }
    const data = req.json();
    return data;
  }
}
