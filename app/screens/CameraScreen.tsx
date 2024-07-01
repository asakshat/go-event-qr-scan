import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  type BarCodeEvent = {
    type: string;
    data: string;
  };

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
    setScanned(true);
    setIsCameraOpen(false);
    try {
      const response = await fetch(`https://eventbooking-go-9c6c8d14446d.herokuapp.com/api/ticket/verify/${data}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
        credentials: 'include',
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log(responseData);
        alert("Success: " + responseData.message);
      } else {
        console.error(responseData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenCamera = () => {
    setScanned(false);
    setIsCameraOpen(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={StyleSheet.absoluteFillObject}
          
        />
       
      ) : (
        <Button title="Open Camera to Scan" onPress={handleOpenCamera} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraWrapper: {
    flex: 1,
    width: '100%', // Adjust width as needed
    height: '100%', // Adjust height as needed
    position: 'relative', // Needed for absolute positioning of CornerBars
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});