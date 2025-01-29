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
  
    const toggleProperty = (prop, option1, option2) => {
      setCameraProps((current)=>({
        ...current,
        [prop]: current[prop] === option1 ? option2 : option1,
      }));
    };

    const zoomIn = () => {
      setCameraProps((current)=>({
        ...current,
        zoom: Math.min(current.zoom + 0.1, 1),
      }));
    };
    const zoomOut = () => {
      setCameraProps((current)=>({
        ...current,
        zoom: Math.max(current.zoom - 0.1, 0),
      }));
    };
  return (
    <View style={styles.container}>
      <View style={styles.tocControlContainer}>
        <Text>Top Controls</Text>
        <Button 
        icon="flip-camera-ios"
        onPress={()=>toggleProperty('facing','back','front')}
        style={{backgroundColor: cameraProps.facing === "back" ? "blue" : "yellow"}}/>
        <Button
        icon= {cameraProps.flash === "on" ? "flash-on" : "flash-off"}
        style={{backgroundColor: cameraProps.flash === "on" ? "blue" : "yellow"}}
        onPress={()=>toggleProperty('flash','on','off')}/>
        <Button
        icon='animation'
        color={cameraProps.animateShutter ? 'green' : 'red'}
        onPress={()=>toggleProperty('animateShutter',true,false)}
        style={{backgroundColor: cameraProps.animateShutter ? "blue" : "yellow"}}

        />
        <Button 
        icon={cameraProps.enableTorch ? "flashlight-off":"flashlight-on"}
        onPress={()=>toggleProperty('enableTorch', true,false)}
        style={{backgroundColor: cameraProps.enableTorch? "yellow" : "blue"}}

        />
      </View>

        <CameraView
        style={styles.camera}
        zoom={cameraProps.zoom}
        facing={cameraProps.facing}
        flash={cameraProps.flash}
        animateShutter={cameraProps.animateShutter}
        enableTorch={cameraProps.enableTorch}

        />
        <View style={styles.sliderContainer}>
          <Button
          icon='zoom-out'
          onPress={zoomOut}
          />
          <Slider 
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={cameraProps.zoom} 
            onValueChange={(value)=>setCameraProps((current)=>({
              ...current,
              zoom: value,}))}
            step={0.1}
          />
          <Button
          icon='zoom-in'
          onPress={zoomIn}
          />
        </View>
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
  slider:{
    flex: 1,
    marginHorizontal: 10,
  },
  sliderContainer:{
    position: 'absolute',
    bottom:120,
    left: 20,
    right: 20,
    flexDirection: 'row',
  }
});
