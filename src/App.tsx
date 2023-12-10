import { useEffect, useState } from "react";
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  UserInfo,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthOptions } from "@web3auth/modal";
import { EthHashInfo } from "@safe-global/safe-react-components";
import Modal from "./common/Modal";

import AppBar from "./AppBar";
import "./App.css";
import "./../src/pages/Crypto.css";

import {
  AuthKitSignInData,
  Web3AuthModalPack,
  Web3AuthEventListener,
} from "@safe-global/auth-kit";
import KYC from "./pages/KYC";
import Crypto from "./pages/Crypto";
import Card from "./common/Card";
import UserProfile from "./common/UserProfile";

const connectedHandler: Web3AuthEventListener = (data) =>
  console.log("CONNECTED", data);
const disconnectedHandler: Web3AuthEventListener = (data) =>
  console.log("DISCONNECTED", data);

function App() {
  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] =
    useState<AuthKitSignInData | null>(null);
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>();
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const options: Web3AuthOptions = {
        clientId:
          import.meta.env.VITE_WEB3AUTH_CLIENT_ID ||
          "BNN52xrxOoUaGWybaXy9BA_CvyqMd2Q4nIF_xmMIxPQhVJySXrCGDYTzK6uhshA7yfjjJORpnYf_3t4NZv74VAo",
        web3AuthNetwork: "testnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x5",
          rpcTarget:
            "https://goerli.infura.io/v3/16be00cf241d4584b8e6ee2f8a1910a6",
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["google", "facebook"],
        },
      };

      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: "torus",
          showOnModal: false,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: "metamask",
          showOnDesktop: true,
          showOnMobile: false,
        },
      };

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: "mandatory",
        },
        adapterSettings: {
          uxMode: "popup",
          whiteLabel: {
            name: "Safe",
          },
        },
      });

      const web3AuthModalPack = new Web3AuthModalPack({
        txServiceUrl: "https://safe-transaction-goerli.safe.global",
      });

      await web3AuthModalPack.init({
        options,
        adapters: [openloginAdapter],
        modalConfig,
      });

      web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);

      web3AuthModalPack.subscribe(
        ADAPTER_EVENTS.DISCONNECTED,
        disconnectedHandler
      );

      setWeb3AuthModalPack(web3AuthModalPack);

      return () => {
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.CONNECTED,
          connectedHandler
        );
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.DISCONNECTED,
          disconnectedHandler
        );
      };
    })();
  }, []);

  useEffect(() => {
    if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
      (async () => {
        await login();
      })();
    }
  }, [web3AuthModalPack]);

  const login = async () => {
    if (!web3AuthModalPack) return;

    const signInInfo = await web3AuthModalPack.signIn();
    console.log("SIGN IN RESPONSE: ", signInInfo);

    const userInfo = await web3AuthModalPack.getUserInfo();
    console.log("USER INFO: ", userInfo);

    setSafeAuthSignInResponse(signInInfo);
    setUserInfo(userInfo || undefined);
    setProvider(web3AuthModalPack.getProvider() as SafeEventEmitterProvider);
  };

  const logout = async () => {
    if (!web3AuthModalPack) return;

    await web3AuthModalPack.signOut();

    setProvider(null);
    setSafeAuthSignInResponse(null);
  };

  const updatedAvailableStatus = localStorage.getItem("anonAadhaar");
  useEffect(() => {
    if (updatedAvailableStatus) {
      const parsedValue = JSON.parse(updatedAvailableStatus);
      console.log("--parsedValue---", parsedValue.status);
    }
  }, [updatedAvailableStatus]);
  const [isModalOpen, setModalOpen] = useState(false);

  const [user, setShowUser] = useState(true);
  const [kyc, setKYC] = useState(false);
  const [upi, setUPI] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const plans = [
    { id: 1, name: "Safe", imgSrc: "images/safe.png" },
    { id: 2, name: "UPI", imgSrc: "images/upi.png" },
    { id: 3, name: "Light House", imgSrc: "images/lighthouse.png" },
    { id: 4, name: "API Setu", imgSrc: "images/api-setu.png" },
    { id: 5, name: "Adhar Annon", imgSrc: "images/adhar.png" },
    // { id: 6, name: "Polygon", imgSrc: "images/polygon.png" },
  ];

  const planElements = plans.map((plan) => (
    <div key={plan.id}>
      <Card title={plan.name} imgSrc={plan.imgSrc} />
    </div>
  ));

  return (
    <>
      <AppBar
        onLogin={login}
        onLogout={logout}
        userInfo={userInfo}
        isLoggedIn={!!provider}
      />
      {safeAuthSignInResponse?.eoa ? (
        <Grid container style={{ backgroundColor: "#ffe7b9", height: "100vh" }}>
          <div className="container">
                {user && (
                  // <div
                  //   style={{
                  //     flex: "1",
                  //     margin: "10px",
                  //     boxSizing: "border-box",
                  //     justifyContent: "center",
                  //     alignContent: "center",
                  //     display: "flex",
                  //     marginTop: "5%",
                  //   }}
                  // >
                    
                      <UserProfile
                        
                        title="test"
                        address={safeAuthSignInResponse.eoa}
                        prefix={getPrefix("0x5")}
                      />
                    
                  //</div>
                )}

                {upi && <Crypto />}

                {kyc && <KYC />}
          
          </div>

          <div>
            <div>
              <div className="sidenav">
                <button
                  onClick={() => {
                    setShowUser(true);
                    setKYC(false);
                    setUPI(false);
                  }}
                >
                  1. Profile
                </button>
                <button
                  onClick={() => {
                    setKYC(true);
                    setShowUser(false);
                    setUPI(false);
                  }}
                >
                  2. KYC
                </button>
                <button
                  onClick={() => {
                    setUPI(true);
                    setShowUser(false);
                    setKYC(false);
                  }}
                >
                  3. Load Crypto via UPI
                </button>
                <button>4. Land NFT</button>
              </div>
            </div>
          </div>

          <Grid item md={4} p={4}>
            {/* <Typography variant="h3" color="secondary" fontWeight={700}>
              Owner account
            </Typography>
            <Divider sx={{ my: 3 }} /> */}
          </Grid>
          <Grid item md={8} p={4}>
            <>
              {/* <Typography variant="h3" color="secondary" fontWeight={700}>
                Available Safes
              </Typography>
              <Divider sx={{ my: 3 }} />
              {safeAuthSignInResponse?.safes?.length ? (
                safeAuthSignInResponse?.safes?.map((safe, index) => (
                  <Box sx={{ my: 3 }} key={index}>
                    <EthHashInfo address={safe} showCopyButton shortAddress={false} />
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="secondary" fontWeight={700}>
                  No Available Safes
                </Typography>
              )} */}
            </>
          </Grid>
        </Grid>
      ) : (
        <>
          <div className="landing-session">
            <div className="container">
              <div className="row">
                <div className="box">
                  <div className="column">
                    <span
                      style={{
                        fontFamily: "Rye, sans-serif",
                        fontSize: "60px",
                        padding: "20px",
                      }}
                    >
                      Land Concealment
                    </span>
                    <br />
                    <span
                      style={{
                        fontFamily:
                          "Cabin Sketch, Monoton, Rye, Yatra One, Young Serif, sans-serif",
                        fontSize: "25px",
                      }}
                    >
                      Blockchain's account abstraction enhances security,
                      privacy, and user experience by allowing interactions
                      without revealing sensitive details.
                    </span>
                  </div>
                  <div className="column">
                    <img src="images/landing-1.png" style={{ height: "80%" }} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="box landing-logo-session">{planElements}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const getPrefix = (chainId: string) => {
  switch (chainId) {
    case "0x1":
      return "eth";
    case "0x5":
      return "gor";
    case "0x100":
      return "gno";
    case "0x137":
      return "matic";
    default:
      return "eth";
  }
};

export default App;
