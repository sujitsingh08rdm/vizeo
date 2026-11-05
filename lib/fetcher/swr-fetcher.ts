import httpRequest from "../http-request/axios-http-request";

const Fetcher = async (url: string) => {
  const { data } = await httpRequest.get(url);
  return data;
};

export default Fetcher;
