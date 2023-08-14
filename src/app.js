import { Auth, getUser } from "./auth";
import {
  getUserFragments,
  getUserFragmentExpand,
  postUserFragments,
  getFragmentDataByID,
  getFragmentInfo,
  putUserFragments,
  deleteFragmentDataById,
} from "./api";

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginButton = document.querySelector("#login");
  const logoutButton = document.querySelector("#logout");
  const postSection = document.querySelector("#post");
  const postButton = document.querySelector("#postButton");
  const getButton = document.querySelector("#getButton");
  const getExpandButton = document.querySelector("#getExpandButton");
  const getByIdButton = document.querySelector("#getByIdButton");
  const getInfoByIdButton = document.querySelector("#getInfoByIdButton");
  const uploadFileButton = document.querySelector("#uploadButton");
  const updateImgButton = document.querySelector("#updateImageButton");
  const putButton = document.querySelector("#putButton");
  const deleteButton = document.querySelector("#deleteButton");

  // Wire up event handlers to deal with login and logout.
  loginButton.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutButton.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutButton.disabled = true;
    return;
  }

  // post the fragment
  postButton.onclick = () => {
    let data = document.querySelector("#data").value || "";
    let type = document.querySelector("#types").value || "";
    postUserFragments(user, data, type);
  };

  // put the fragment
  putButton.onclick = () => {
    let data = document.querySelector("#data").value || "";
    let type = document.querySelector("#types").value || "";
    let id = document.querySelector("#id").value;
    putUserFragments(user, data, type, id);
    console.log("put", data);
  };

  // delete the fragment
  deleteButton.onclick = () => {
    let id = document.querySelector("#id").value;
    deleteFragmentDataById(user, id);
  };

  // get the list of fragments id for the authenticated user
  getButton.onclick = () => {
    getUserFragments(user);
  };

  // get the list of fragments id for the authenticated user
  getExpandButton.onclick = () => {
    getUserFragmentExpand(user);
  };

  getByIdButton.onclick = () => {
    let id = document.querySelector("#id").value;
    document.getElementById("receivedTitle").innerHTML =
      "Received Fragment Data:";
    getFragmentDataByID(user, id);
  };

  getInfoByIdButton.onclick = () => {
    let id = document.querySelector("#id").value;
    document.getElementById("receivedTitle").innerHTML =
      "Received Fragment Info:";
    getFragmentInfo(user, id);
  };

  uploadFileButton.onclick = () => {
    let data = document.getElementById("file").files[0];

    if (data != null) {
      alert("your file has been uploaded");
    } else {
      alert("choose a file first");
    }
    postUserFragments(user, data, data.type);
  };

  updateImgButton.onclick = () => {
    let data = document.getElementById("file").files[0];
    let id = document.querySelector("#id").value;
    putUserFragments(user, data, data.type, id);
    console.log("update", data);
  };

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector(".username").innerText = user.username;

  // Disable the Login button
  loginButton.disabled = true;
  if ((loginButton.disabled = true)) {
    postSection.hidden = false;
  }
}

// Wait for the DOM to be ready, then start the app
addEventListener("DOMContentLoaded", init);
