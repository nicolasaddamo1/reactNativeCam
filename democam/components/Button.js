import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
export default Button = ({icon,size,color,style, onPress}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <MaterialIcons name={icon}
            size={size? size : 24 }
            color={color} />
        </TouchableOpacity>
    ); 
}

const styles = StyleSheet.create({
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
});