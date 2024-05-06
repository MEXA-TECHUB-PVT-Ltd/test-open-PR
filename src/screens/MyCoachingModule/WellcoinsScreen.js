import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import fonts from '../../theme/fonts';
import colors from '../../theme/colors';
import CustomButton from '../../components/ButtonComponent';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { resetNavigation } from '../../utilities/resetNavigation';


const WellcoinsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    style={{ width: 324, height: 304 }}
                    source={require('../../assets/images/payment_success_img.png')} />
                <Text style={{
                    fontFamily: fonts.fontsType.bold,
                    fontSize: 22,
                    color: colors.primaryColor,
                    marginTop: 20,
                }}>Congratulations!</Text>
                <Text style={{
                    fontFamily: fonts.fontsType.medium,
                    fontSize: 14,
                    color: colors.blackTransparent,
                    marginTop: 20,
                }}>You have received 10 Wellcoins</Text>
            </View>
            <CustomButton
                onPress={() => {
                    resetNavigation(navigation, "Dashboard", { screen: "MyCoaching" })
                }}
                title={"Go Back"}
                customStyle={{
                    top: heightPercentageToDP('13%'),
                    width: widthPercentageToDP('80%')
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

export default WellcoinsScreen;
