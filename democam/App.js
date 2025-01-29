import { StatusBar } from 'expo-status-bar';
import React,{ useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';

export default function App() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions(); 
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  console.log("camera permissions:", cameraPermission);
  console.log("media permissions:", mediaLibraryPermission);
    if( !cameraPermission || !mediaLibraryPermission ){
        return (
            <View style={styles.container}>
                <Text>Permissions not granted</Text>
            </View>
        );
    }
    if(!cameraPermission.granted || mediaLibraryPermission.status !== 'granted'){
        return (
            <View style={styles.container}>
                <Text>Permission needed</Text>
                <TouchableOpacity style={styles.button} onPress={() => {
                    requestCameraPermission();
                    requestMediaLibraryPermission();
                }}>
                  <Text style={styles.buttonText}>Grant Permissions</Text>
                </TouchableOpacity>
            </View>
        );
    }
  
  return (
    <View style={styles.container}>
        <CameraView style={styles.camera} />
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
  button: {
    padding: 10,
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
