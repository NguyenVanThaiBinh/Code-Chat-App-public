import OneSignal from "react-onesignal";
import { app_id, api_key } from "../pages/index";

export async function runOneSignal() {
  await OneSignal.init({
    appId: app_id,
    notifyButton: {
      enable: true,
      size: "large",
    },
    allowLocalhostAsSecureOrigin: true,
  });
  OneSignal.showSlidedownPrompt();
}
export function getDevicesFromOneSignal() {
  const options = {
    method: "GET",
    headers: { accept: "text/plain", Authorization: api_key },
  };
  fetch(`https://onesignal.com/api/v1/players?app_id=${app_id}`, options).then(
    (response) => response.json()
  );
}

export function deletePlayerId(playerId: string) {
  const options = {
    method: "DELETE",
    headers: { accept: "text/plain", Authorization: api_key },
  };
  fetch(
    `https://onesignal.com/api/v1/players/${playerId}?app_id=${app_id}`,
    options
  ).then((response) => response.json());
}

export function sendNotification(data: any) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: api_key,
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers,
  };

  var https = require("https");
  var req = https.request(options, function (res: any) {
    res.on("data", function (data: any) {});
  });

  req.write(JSON.stringify(data));
  req.end();
}
