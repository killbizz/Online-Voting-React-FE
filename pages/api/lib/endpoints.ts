import Fetcher from "./fetcher";

export default async function getBackendResponse(
  funName: string,
  method: string,
  params: string | null
) {
  const fetcher = new Fetcher(funName);
  return {
    props: {
      response: await fetcher.getJSONResponse(method, params),
    },
  };
}
