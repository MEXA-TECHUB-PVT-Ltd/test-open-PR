import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, Dimensions, FlatList, SafeAreaView } from 'react-native';
import colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
const BADGE_IMG = require('../../../assets/images/main_stays_badge_img.png')

const BadgeComponent = ({
    badgeName,
    badgeReviewText,
    customStyle,
    imageTintColor,
    customNameStyle,
    onPress
}) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPress}
                style={[styles.badgeContainer, customStyle]}>
                <Image tintColor={imageTintColor} source={BADGE_IMG} style={styles.badgeImage} />
            </TouchableOpacity>
            <View style={styles.badgeTextContainer}>
                <Text style={[styles.badgeName, customNameStyle]}>{badgeName}</Text>
                <Text style={styles.badgeText}>{badgeReviewText}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'

    },
    badgeContainer: {
        width: 105,
        height: 105,
        justifyContent: 'center',
        margin: 10,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: '#CD7F32'
    },
    badgeImage: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    badgeTextContainer: {
        marginTop: 5,
        alignSelf: 'center',
        paddingHorizontal: 10
    },
    badgeName: {
        fontSize: 18,
        fontFamily: fonts.fontsType.bold,
        color: '#CD7F32',
        alignSelf: 'center'
    },
    badgeText: {
        fontSize: 14,
        fontFamily: fonts.fontsType.medium,
        color: '#979797',
        alignSelf: 'center',
        marginTop: 10
    },
});

export default BadgeComponent;
