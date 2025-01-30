import { StatusBar } from 'expo-status-bar';
import React,{ useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';
import Button from './components/Button';

export default function App() {
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const [cameraPermission, requestCameraPermission] = useCameraPermissions(); 
    const [previousImage, setPreviousImage] = useState(null);
    const [image, setImage] = useState(null);
    const [cameraProps, setCameraProps] = useState({
      zoom: 0,
      facing: 'back',
      flash: 'on',
      animateShutter: true,
      enableTorch: false,
    });

    const cameraRef = useRef(null);

    useEffect(()=>{
      if (cameraPermission && cameraPermission.granted && mediaLibraryPermission && mediaLibraryPermission.status === 'granted'){
      
      getLastSavedImage();}
    },[ cameraPermission, mediaLibraryPermission]);


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
    const takePicture = async () => {
      if (cameraRef.current){
        try{
          const picture = await cameraRef.current.takePictureAsync();
          setImage(picture.uri);
        }
        catch (error){
          console.log(error);
        }
      }
    };
    const savePicture = async () =>{
      if(image){
        try{
          const asset = await MediaLibrary.createAssetAsync(image)
          const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
          Alert.alert('Picture saved', image);
          setImage(null);

        }catch(error){
          console.log(error);
        }
    }
  }

  const getLastSavedImage = async () => {
    if (mediaLibraryPermission && mediaLibraryPermission.status === 'granted'){
      const dcimAlbum = await MediaLibrary.getAlbumAsync('DCIM');
      if (dcimAlbum){
        const {assets} = await MediaLibrary.getAssetsAsync({album: dcimAlbum, sortBy:[[MediaLibrary.SortBy.creationTime, false]], mediaType:MediaLibrary.MediaType.photo, first: 1});
        if (assets.length > 0){
          const assetInfo = await MediaLibrary.getAssetInfoAsync(assets[0].id);
          setPreviousImage(assetInfo.localUri || assetInfo.uri);
        }else{
          setPreviousImage(null);
        }
      }else{
        setPreviousImage(null);
      }
  }
}
  return (
    <View style={styles.container}>
      {!image ? (
        <>
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
        ref={cameraRef}
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
        <View style={styles.bottomControlContainer}>
          <TouchableOpacity onPress={()=> previousImage && setImage(previousImage)}>
              <Image 
              source={{uri: previousImage}}
              style={styles.previousImage}
              />
          </TouchableOpacity>
              <Button 
              icon='camera'
              size={60}
              style={{ height: 60,
              }}
              onPress={takePicture}
              />

        </View>
        </>
    ) : (
      <>
      <Image source={{uri:image}} style={styles.camera}/>
      <View style={styles.bottomControlContainer}>
        <Button
        icon = 'delete'
        onPress={()=>setImage(null)}
        />
        <Button
        icon='save'
        onPress={savePicture}
        />

      </View>
      </>
    )

   }
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
  },
  bottomControlContainer:{
    height: 100,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    imageresizeMode: 'stretch',
  },
  previousImage:{
    height: 50,
    width: 50,
    borderRadius: 20,
  }

});
