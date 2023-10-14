import type { NextPage } from "next";
import Head from "next/head";
import Body from "./Body";
import React from "react";
import Script from "next/script";

// export const server = "http://localhost:3000";
// export const app_id = "e897e93f-4193-4db6-a7bf-9b09ad884c51";
// export const api_key = "Basic MzkxODI3MzgtZjgwOC00ZWI2LWJkNjItMjNiYTljMDdmYWVh";

export const server = "https://binh-hu.vercel.app";
export const app_id = "8dcb570d-4d42-4ed5-b20a-c3e94d97c506";
export const api_key = "Basic OWYyODQwMzgtYzAzMC00MjU2LTliMTAtNTQyMmMwZjczMDQ4";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Chat App Binh Hu</title>
        <meta name="description" content="" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <Script
        src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
        async
      ></Script>
      <Body />
    </div>
  );
};

export default Home;
