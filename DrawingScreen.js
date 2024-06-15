import SignatureView from "react-native-signature-canvas";
import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { useContext } from "react";
import DrawingSuccessContext from "./DrawingSuccessContext.js";
import * as Notifications from "expo-notifications";

export default function DrawingScreen() {
  const [alarmIsGoingOff, setAlarmIsGoingOff] = useContext(
    DrawingSuccessContext
  );
  const ref = useRef();
  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = async (signature) => {
    const imageBase64 = signature.replace("data:image/png;base64,", "");
    const response = await fetch("http://localhost:7771/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64: imageBase64,
        label: "flower",
      }),
    }).then(console.log(JSON.stringify(response)));
    const data = await response.json();
    if (data.success) {
      setAlarmIsGoingOff(false);
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test",
          body: "Notification test",
          sound: "alarm.wav",
        },
        trigger: {
          seconds: 0,
        },
      });
    }
  };
  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    console.log("Empty");
  };
  return (
    <SignatureView
      ref={ref}
      descriptionText="draw a flower"
      onOK={handleOK}
      onEmpty={handleEmpty}
    />
  );
}
