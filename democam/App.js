import { StatusBar } from 'expo-status-bar';
import React,{ useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';
import Button from './components/Button';

export default function App() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions(); 
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const [cameraProps, setCameraProps] = useState({
      zoom: 0,
      facing: 'back',
      flash: 'on',
      animateShutter: true,
      enableTorch: false,
    });
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
                <Text style={styles.tocControlContainer}>Permission needed</Text>
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
      <View style={styles.tocControlContainer}>
        <Text>Top Controls</Text>
        <Button 
        icon="flip-camera-ios"/>
        <Button
        icon="flash-on" />
        <Button
        icon='animation' />
        <Button 
        icon='flashlight-on'/>
        <Button />
      </View>

        <CameraView
        style={styles.camera}
        zoom={cameraProps.zoom}
        facing={cameraProps.facing}
        flash={cameraProps.flash}
        animateShutter={cameraProps.animateShutter}
        enableTorch={cameraProps.enableTorch}

        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 25
  },
  tocControlContainer: {
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
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
