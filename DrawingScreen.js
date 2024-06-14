import SignatureView from "react-native-signature-canvas";
import React, { useEffect } from "react";
import { useRef } from "react";

export default function DrawingScreen() {
  const ref = useRef();
  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {
    console.log(signature);
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
