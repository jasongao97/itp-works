const welcomePage = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link
      href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css"
      rel="stylesheet"
    />
    <title>${SITE_TITLE}</title>
  </head>
  <body class="bg-indigo-700">
    <div class="w-full py-12 px-6 flex flex-col items-center">
      <h1 class="text-4xl font-bold text-white">${SITE_TITLE}</h1>
      <p class="mt-2 text-lg text-indigo-300">
        Get a shorter link for your projects
      </p>

      <div class="mt-8 flex items-center space-x-8 text-indigo-800">
        <div
          class="relative text-xs transform -rotate-2 bg-indigo-400 w-60 p-3 rounded break-all"
        >
          https://xxxxx.notion.site/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx<span
            class="absolute bottom-0 right-0 transform translate-x-2 translate-y-2 text-2xl"
            >❌</span
          >
        </div>
        <div
          class="text-sm transform rotate-2 bg-indigo-400 p-3 rounded break-all"
        >
          https://${DOMAIN_NAME}/xxxxxx<span
            class="absolute bottom-0 right-0 transform translate-x-2 translate-y-4 text-2xl"
            >✅</span
          >
        </div>
      </div>

      <div
        id="result"
        class="hidden flex flex-col items-center mt-12 bg-white shadow-lg p-8 rounded"
      >
        <h2 class="text-2xl font-bold text-gray-900">Congratulation</h2>
        <p class="mt-2 text-gray-600">You can access your page now at</p>
        <a
          class="mt-4 py-8 px-10 text-2xl flex items-center space-x-1 group"
          id="destinationLink"
          href="/"
          target="_blank"
        >
          <span id="destinationName" class="group-hover:underline"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-600 transform scale-75"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      <div
        id="form"
        class="flex flex-col items-center mt-12 bg-white shadow-lg p-6 rounded space-y-6"
      >
        <div class="w-full">
          <label class="block text-gray-600 text-sm mb-2">Alias</label>
          <div class="flex space-x-2 items-center">
            <p class="py-2 text-lg font-bold italic tracking-wide">
              ${DOMAIN_NAME}/
            </p>
            <input
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-white focus:border-purple-500"
              id="alias"
              type="text"
              placeholder="henryiswhy"
            />
          </div>
        </div>

        <div class="w-full">
          <label class="block text-gray-600 text-sm mb-2">
            Your long URL
          </label>

          <textarea
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-white focus:border-purple-500"
            id="url"
            type="text"
            placeholder="https://xxxxx.notion.site/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          ></textarea>
        </div>

        <button
          class="w-full flex items-center justify-center p-2 text-white bg-indigo-500 rounded hover:bg-indigo-700"
          onclick="submit()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="spining-icon"
            class="h-6 w-6 mr-1 animate-spin hidden"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Make Link</span>
        </button>
      </div>

      <p class="mt-8 text-center text-indigo-400 text-xs">
        &copy; 2022 Built by Jason Gao with Cloudflare Worker
      </p>
    </div>

    <script>
      const alias = document.querySelector("#alias");
      const destinationURL = document.querySelector("#url");
      const spinningIcon = document.querySelector("#spining-icon");
      const resultDialog = document.querySelector("#result");
      const formDialog = document.querySelector("#form");
      const destinationLink = document.querySelector("#destinationLink");
      const destinationName = document.querySelector("#destinationName");

      function submit() {
        let complete = true;

        if (!alias.value) {
          alias.classList.add("ring-2");
          alias.classList.add("ring-red-400");

          complete = false;
        }

        if (!destinationURL.value) {
          destinationURL.classList.add("ring-2");
          destinationURL.classList.add("ring-red-400");

          complete = false;
        }

        if (!complete) return;

        spinningIcon.classList.remove("hidden");

        fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            alias: alias.value,
            destinationURL: destinationURL.value,
          }),
        })
          .then((data) => {
            return data.json();
          })
          .then((response) => {
            if (response.result == "SUCCESS") {
              destinationName.innerHTML = response.name;
              destinationLink.href = response.href;
              resultDialog.classList.remove("hidden");
              formDialog.classList.add("hidden");
              spinningIcon.classList.add("hidden");
            }
          });
      }
    </script>
  </body>
</html>
`;

function responseJSON(response = {}) {
  return new Response(JSON.stringify(response), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

function isValidURL(inputString) {
  let url;

  try {
    url = new URL(inputString);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

async function handlePostRequest(request) {
  const { headers } = request;
  const { pathname } = new URL(request.url);

  const contentType = headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return responseJSON({ result: "FORMAT_NOT_ACCEPTED" });
  }

  const { alias, destinationURL } = await request.json();

  if (pathname == "/") {
    if (!alias || !destinationURL) {
      return responseJSON({ result: "INVALID_PARAMETERS" });
    }

    // if (alias.length < 3) {
    //   return responseJSON({ result: "ALIAS_TOO_SHORT" });
    // }

    if (!isValidURL(destinationURL)) {
      return responseJSON({ result: "INVALID_URL" });
    }

    const existRule = await ALIAS_MAP.get(`/${alias}`);
    if (existRule !== null) {
      return responseJSON({ result: "ALREADY_EXIST" });
    }

    await ALIAS_MAP.put(`/${alias}`, destinationURL);

    return responseJSON({
      result: "SUCCESS",
      name: `${DOMAIN_NAME}/${alias}`,
      href: `https://${DOMAIN_NAME}/${alias}`,
    });
  }

  return responseJSON({ result: "PATH_NOT_ACCEPTED" });
}

async function handleGetRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname == "/") {
    return new Response(welcomePage, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  }

  const destinationURL = await ALIAS_MAP.get(decodeURI(pathname));
  if (destinationURL === null) {
    return Response.redirect(`https://${DOMAIN_NAME}/`, 301);
  }

  return Response.redirect(destinationURL, 301);
}

addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method === "POST") {
    return event.respondWith(handlePostRequest(request));
  } else if (request.method === "GET") {
    return event.respondWith(handleGetRequest(request));
  }
});
