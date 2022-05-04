import cookie from 'js-cookie';
import { ErrorResponse } from '../../../classes/ErrorResponse';

export default class Fetcher {
  url: URL;

  constructor(funName: string) {
    this.url = new URL(
      //`http://localhost:8080/${funName}`
      // Google Compute Engine
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/${funName}`
    );
  }

  async getJSONResponse(method: string, params: string | null = null): Promise<any> {
    // let token: string | undefined = undefined;
    // let jwtToken: string | undefined = undefined;
    // if (!!cookie.get("jwtToken")){
    //   token = cookie.get("jwtToken");
    //   jwtToken = "Bearer " + token;
    // }
    let header: HeadersInit = {
      "Content-Type": "application/json"
    };
    // add JWT if present in a cookie
    // Object.assign(header, token !== undefined ? { "Authorization": jwtToken } : null);
    let req = null;
    if (method === "GET") {
      req = await fetch(this.url.href, {
        headers: header
      });
    } else {
      req = await fetch(this.url.href, {
        body: params,
        headers: header,
        method,
      });
    }
    if(method === "DELETE" && req.status === 204){
      return {
        status: 204
      }
    }
    if(!req.ok){
      //return new ErrorResponse(req.status, req.statusText);
      return {
        error: req.statusText
      }
    }
    // if(req.status === 404){
    //   return {
    //     error: "error 404, not found"
    //   }
    // }
    // if(req.status === 400){
    //   return {
    //     error: "error 400, bad request"
    //   }
    // }
    // if(req.status === 403){
    //   return {
    //     error: "error 403, forbidden"
    //   }
    // }
    // if(method === "DELETE" && req.status === 204){
    //   return {
    //     error: 204
    //   }
    // }
    const data = req.json();
    return data;
  }
}
