//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

// create a component
const HomeWelcome = () => {
    return (
        <View style={styles.container}>
            <Image style={{ width: 283, height: 219, marginVertical:40 }} source={require('../../../assets/images/coach_welcome_img.png')} />

            <Text style={{
                color: colors.primaryColor,
                fontFamily: fonts.fontsType.bold,
                fontSize: 21,
                lineHeight: 27,
                
            }}>Welcome Onboard Coach!</Text>

            <Text style={{
                color: colors.blackTransparent,
                fontFamily: fonts.fontsType.medium,
                fontSize: 15,
                lineHeight: 24,
                textAlign:'center',
                marginVertical:10
            }}>Your coaching journey begins here Let's empower lives together!</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
});

//make this component available to the app
export default HomeWelcome;
