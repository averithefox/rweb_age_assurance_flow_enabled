function patch({ requestId }) {
  const filter = browser.webRequest.filterResponseData(requestId);
  const decoder = new TextDecoder();

  let body = "";

  filter.ondata = (event) => {
    body += decoder.decode(event.data, { stream: true });
  };

  filter.onstop = () => {
    body += decoder.decode();
    filter.write(
      new TextEncoder().encode(body.replace(/(?<="rweb_age_assurance_flow_enabled":\{"value":)true(?=})/g, "false")),
    );
    filter.close();
  };
}

browser.webRequest.onBeforeRequest.addListener(
  patch,
  {
    urls: ["*://x.com/*"],
  },
  ["blocking"],
);
