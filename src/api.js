// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || "http://localhost:8080";

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", data.fragments);

    // display it for the user to see
    // as a list
    const listContainer = document.createElement("ul");
    data.fragments.forEach((fragmentID) => {
      const listItem = document.createElement("li");
      listItem.textContent = fragmentID;
      listContainer.appendChild(listItem);
    });
    const fraglist = document.getElementById("fragmentList");
    fraglist.innerHTML = "";
    fraglist.appendChild(listContainer);

    // display as a json
    // const pre = document.createElement("pre");
    // pre.innerHTML = JSON.stringify(data, undefined, 4);
    // const fraglist = document.getElementById("fragmentList");
    // fraglist.innerHTML = "";
    // fraglist.appendChild(pre);
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function getUserFragmentExpand(user) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/?expand=1`, {
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log(data.fragments);

    // display it for the user to see
    const pre = document.createElement("pre");
    pre.innerHTML = JSON.stringify(data, undefined, 4);
    const fraglist = document.getElementById("fragmentList");
    fraglist.innerHTML = "";
    fraglist.appendChild(pre);
  } catch (err) {
    console.error("Unable to call GET /v1/fragment/?expand=1", { err });
  }
}

export async function postUserFragments(user, data, type) {
  console.log("Posting user fragments data...");
  try {
    if (type == "application/json") {
      data = JSON.parse(JSON.stringify(data));
    }

    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": type,
      },
      body: data,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    console.log("Posted user fragments data: ", data);
    console.log(res);
  } catch (err) {
    console.error("Unable to call POST /v1/fragments", { err });
  }
}

export async function getFragmentDataByID(user, id) {
  try {
    if (id != "") {
      console.log(`Requesting fragment data by ID: ${id}`);
      console.log(`Fetching from ${apiUrl}/v1/fragments/${id}`);
      const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
        headers: user.authorizationHeaders(),
      });

      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      const data = await res.text();
      console.log("Received:", data);
      document.getElementById("returnedData").innerHTML = data;
    } else {
      document.getElementById("returnedData").textContent =
        "Error: ID required";
      console.log("Error: ID required");
    }
  } catch (err) {
    console.log(`Unable to call GET /v1/fragments/${id}`, { err });
  }
}

export async function getFragmentInfo(user, id) {
  console.log(`Requesting user fragments info by id...${id}`);
  console.log(`Fetching ${apiUrl}/v1/fragments/${id}/info`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    let data = await res.json();
    console.log(data);

    // display as a json
    const pre = document.createElement("pre");
    pre.innerHTML = JSON.stringify(data, undefined, 4);
    const fraglist = document.getElementById("returnedData");
    fraglist.innerHTML = "";
    fraglist.appendChild(pre);
  } catch (err) {
    console.error(`Unable to call GET /v1/fragments/${id}/info`, { err });
  }
}
