import { AuthProvider } from "@arcana/auth";
import { myerc20abi } from "./myerc20.js";

const clientId = "xar_dev_f0176ff917a736e93cebed58106750a68f7b5d2a";

//Arcana Auth SDK integration

let provider;
const auth = new AuthProvider(clientId, {
  network: 'dev',
  position: 'right',
  chainConfig: {
    chainId: '80001', //polygon mumbai
  }
});

provider = auth.provider;
setHooks();

function setHooks() {
  provider.on("connect", async (params) => {
    console.log({ type: "connect", params: params });
    document.querySelector("#event").innerHTML = "connect Event";
  });
  provider.on("accountsChanged", (params) => {
    console.log({ type: "accountsChanged", params: params });
    document.querySelector("#event").innerHTML = "accountsChanged Event";
  });
  provider.on("chainChanged", async (params) => {
    console.log({ type: "chainChanged", params: params });
    document.querySelector("#event").innerHTML = "chainChanged Event";
  });
  provider.on("disconnect", async (params) => {
    console.log({ type: "disconnect", params: params });
    document.querySelector("#event").innerHTML = "disconnect Event";
  });
  provider.on("message", async (params) => {
    console.log({ type: "message", params: params });
    document.querySelector("#event").innerHTML = "message Event";
  });
}

async function initAuth() {
  try {
    console.log("Instantiating Auth... ");
    document.querySelector("#result").innerHTML =
      "Initializing Auth. Please wait...";
    console.time("auth_init");
    await auth.init();
    console.timeEnd("auth_init");
    console.log("Init auth complete!");
    document.querySelector("#result").innerHTML =
      "Auth initialized. Now you can continue.";
    console.log({ provider });
  } catch (e) {
    console.log({ e });
  }
}

async function getLogins() {
  let authOptions = "";
  try {
    console.log("Get logins");
    const logins = await auth.getLogins();
    for (var i = 0; i < logins.length; i++) {
      authOptions = authOptions + logins[i].toString() + ", ";
    }
    authOptions = authOptions.slice(0, -1);
    document.querySelector("#result").innerHTML =
      "Available Auth Options: \n" + authOptions;
    console.log({ logins });
  } catch (e) {
    console.log(e);
  }
}

async function getAppId() {
  try {
    const appId = await auth.appId;
    console.log("App id:", appId);
    document.querySelector("#result").innerHTML = "AppId: " + appId;
  } catch (e) {
    console.log(e);
  }
}

async function connect() {
  try {
    await auth.connect();
    document.querySelector("#result").innerHTML =
      "Connect: User logged in successfully!";
  } catch (e) {
    console.log(e);
  }
}

async function isLoggedIn() {
  try {
    let ans = await auth.isLoggedIn();
    if (true == ans)
      document.querySelector("#result").innerHTML =
        "Yes, User: " +
        ENV_USER_LOGIN_EMAIL +
        "is logged in aready!";
    else
      document.querySelector("#result").innerHTML =
        "No, user is not yet logged in!";
  } catch (e) {
    console.log(e);
  }
}

async function logout() {
  console.log("Requesting logout");
  try {
    await auth.logout();
    document.querySelector("#result").innerHTML =
      "Logout: You are now logged out!";
  } catch (e) {
    console.log({ e });
  }
}
async function gaslessTx() {
  console.log("Initiating gasless transaction...");
  try {
    const erc20Address = "0x06F51271DCe73e3Fb09637e77Bfb0e996DAb39cf";
    const toAddress = "0xD12E6864A0f0f3Ea886400Ae7570E4341889bDa9";
    const Erc20Interface = new ethers.utils.Interface(myerc20abi);

    // Encode an ERC-20 token transfer to recipientAddress of the specified amount

    // Note: the 'transfer' operation  of the smart contract used below
    // must be whitelisted earlier via the dashboard for gasless transaction
    const encodedData = Erc20Interface.encodeFunctionData("transfer", [
      toAddress,
      amount,
    ]);
    
    // Perform send transaction in a gasless manner 
    const transactionHash = 0;

    document.querySelector("#result").innerHTML =
      "txHash:" + txDetails.receipt.transactionHash;
  } catch (e) {
    console.log(e);
  }
  console.log("Gasless transaction done!");
}

document.querySelector("#Btn-InitAuth").addEventListener("click", initAuth);
document.querySelector("#Btn-GetLogins").addEventListener("click", getLogins);
document.querySelector("#Btn-GetAppId").addEventListener("click", getAppId);
document.querySelector("#Btn-Connect").addEventListener("click", connect);
document.querySelector("#Btn-Logout").addEventListener("click", logout);
document.querySelector("#Btn-IsLoggedIn").addEventListener("click", isLoggedIn);
document.querySelector("#Btn-Do-Gasless-Tx") .addEventListener("click", gaslessTx); 

