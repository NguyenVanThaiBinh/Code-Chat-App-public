import Swal from "sweetalert2";
import axios from "axios";
import { signOut } from "next-auth/react";

import { server } from "../index";
import { useEffect } from "react";

export default function CheckShowAlertValidToken(userEmail: string) {
  if (typeof window !== "undefined") {
    let isShowAlert = localStorage.getItem("isShowAlert") as any;
    if (isShowAlert == "true") {
      Swal.fire({
        title: "Your access token is invalid. Please log in again!",
      }).then((result: any) => {
        if (result.isConfirmed) {
          try {
            localStorage.setItem("isShowAlert", "false");

            axios.post(server + "/api/users/updateUserStatus", {
              email: userEmail,
              status: false,
            });
            signOut();
          } catch (error) {
            console.warn("update User status fail!");
          }
        }
      });
      return true;
    }
  }
  return false;
}
