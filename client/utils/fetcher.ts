import axios from "axios";

export default async function fetcher(url: string, headers = {}) {
  try {
    const res = await axios.get(url, {
      headers,
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    //@ts-ignore
    console.error(error.message);
    return null;
  }
}
