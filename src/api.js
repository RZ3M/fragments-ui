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

      // Create the text node for the fragment ID
      const textNode = document.createTextNode(fragmentID);
      listItem.appendChild(textNode);

      // Create a link and event listener to it
      const getDataLink = document.createElement("a");
      getDataLink.textContent = "GET DATA";
      getDataLink.style.marginLeft = "10px";
      getDataLink.href = "#";
      getDataLink.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#id").value = fragmentID;
        getFragmentDataByID(user, fragmentID);
        document.getElementById("receivedTitle").innerHTML =
          "Received Fragment Data:";
      });
      listItem.appendChild(getDataLink);

      // Create a link and event listener to it
      const getInfoLink = document.createElement("a");
      getInfoLink.textContent = "GET INFO";
      getInfoLink.style.marginLeft = "10px";
      getInfoLink.href = "#";
      getInfoLink.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#id").value = fragmentID;
        getFragmentInfo(user, fragmentID);
        document.getElementById("receivedTitle").innerHTML =
          "Received Fragment Info:";
      });
      listItem.appendChild(getInfoLink);

      // Create a link and event listener to it
      const deleteLink = document.createElement("a");
      deleteLink.textContent = "DELETE";
      deleteLink.style.marginLeft = "10px";
      deleteLink.href = "#";
      deleteLink.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#id").value = fragmentID;
        deleteFragmentDataById(user, fragmentID);
        clearData("f");
        getUserFragments(user);
      });
      listItem.appendChild(deleteLink);

      // Add the completed list item to the list container
      listContainer.appendChild(listItem);
    });
    const fraglist = document.getElementById("fragmentList");
    fraglist.innerHTML = "";
    fraglist.appendChild(listContainer);
  } catch (err) {
    console.error(`Unable to call GET ${apiUrl}/v1/fragment`, { err });
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
    console.error(`Unable to call GET ${apiUrl}/v1/fragment/?expand=1`, {
      err,
    });
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
    alert("Successfully Posted Fragment!");
    console.log("Posted user fragments data: ", data);
    console.log(res);
  } catch (err) {
    alert("Error Posting Fragment");
    console.error(`Unable to call POST ${apiUrl}/v1/fragments`, { err });
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

      const type = res.headers.get("Content-Type");
      // text
      if (type.includes("text")) {
        const data = await res.text();
        console.log("Received:", data);
        document.getElementById("returnedData").innerHTML = data;
      }
      // image
      if (type.startsWith("image/")) {
        const data = await res.blob();
        console.log("Received:", data);

        var img = document.createElement("img");
        img.src = URL.createObjectURL(data);
        const display = document.getElementById("returnedData");
        display.innerHTML = "";
        display.appendChild(img);
      }
      // json
      if (type.includes("json")) {
        const data = await res.json();

        // display as a json
        const pre = document.createElement("pre");
        pre.innerHTML = JSON.stringify(data, undefined, 4);
        const display = document.getElementById("returnedData");
        display.innerHTML = "";
        display.appendChild(pre);
      }
    } else {
      alert("Error: ID required!");
      console.log("Error: ID required!");
    }
  } catch (err) {
    alert("Error: Invalid ID!");
    console.log(`Unable to call GET ${apiUrl}/v1/fragments/${id}`, { err });
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
    alert("Error: Invalid ID!");
    console.error(`Unable to call GET ${apiUrl}/v1/fragments/${id}/info`, {
      err,
    });
  }
}

export async function putUserFragments(user, data, type, id) {
  console.log("Updating user fragments data...");
  try {
    if (type == "application/json") {
      data = JSON.parse(JSON.stringify(data));
    }
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "put",
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
        "Content-type": type,
      },
      body: data,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    alert("Successfully updated fragment data!");
    console.log("Updated user fragments data", data);
    console.log(res);
  } catch (err) {
    alert("Failed to update fragment data!");
    console.error("Unable to call PUT /v1/fragment", { err });
  }
}

export async function deleteFragmentDataById(user, id) {
  console.log(`Deleting user fragment with id: ${id}`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "delete",
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    clearData("fr");
    alert("Successfully deleted Fragment!");
    console.log(`Fragment ${id} successfully deleted`);
    console.log(res);
  } catch (err) {
    alert("Error: Invalid ID!");
    console.error(`Unable to call DELETE /v1/fragments/${id}`, { err });
  }
}

export function clearData(option) {
  if (option.includes("f")) {
    const fraglist = document.getElementById("fragmentList");
    fraglist.innerHTML = "";
  }
  if (option.includes("r")) {
    const returnedData = document.getElementById("returnedData");
    returnedData.innerHTML = "";
  }
}
