export async function cloudflareFetch<T>(url: string): Promise<T> {
  const response = await fetch(process.env.FLARESOLVERR_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cmd: "request.get",
      maxTimeout: 60000,
      url,
    }),
  });

  const flaresolverResponse = await response.json();
  let data: string = flaresolverResponse.solution.response;

  // Get rid of the chrome garbage html around the json
  let start = data.search(/\[|\{/);
  const startCharacter = data[start];
  let end = data.lastIndexOf(startCharacter === "[" ? "]" : "}");
  data = data.substring(start, end + 1);

  return JSON.parse(data) as T;
}
