import { StatusBar } from 'expo-status-bar';
import React,{ useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';

export default function App() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions(); 
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();

    if(!cameraPermission || !mediaLibraryPermission){
        return (
            <View style={styles.container}>
                <Text>Permissions not granted</Text>
                <Button title="Request Camera Permission" onPress={requestCameraPermission} />
                <Button title="Request Media Library Permission" onPress={requestMediaLibraryPermission} />
            </View>
        );
    }
    if(!cameraPermission.granted || !mediaLibraryPermission.status !== 'granted'){
        return (
            <View style={styles.container}>
                <Text>Permission needed</Text>
            </View>
        );
    }
  
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
