import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, Dimensions, FlatList, SafeAreaView } from 'react-native';
import colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import BadgeComponent from '../Components/BadgeComponent';
import HeaderComponent from '../../../components/HeaderComponent';
import { BottomSheet } from "@rneui/themed";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomButton from '../../../components/ButtonComponent';

const BadgesScreen = ({navigation}) => {
    const [badgeSheetVisible, setBadgeSheetVisible] = useState(false);
    const BADGE_IMG = require('../../../assets/images/main_stays_badge_img.png')
    
    const [badgeContent, setBadgeContent] = useState({
        tintColor: '#CD7F32',
        text: 'Only 08 more 4 star reviews to go until your gold badge'
    })

    const renderBadgeSheet = () => {
        return (
            <BottomSheet modalProps={{}} isVisible={badgeSheetVisible}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: '100%',
                        height: hp('40%'),
                        borderTopEndRadius: 40,
                        borderTopStartRadius: 40,
                        padding: 10,
                    }}>
                    <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            tintColor={badgeContent.tintColor}
                            source={BADGE_IMG}
                            style={styles.badgeImage} />
                        <Text style={{
                            fontFamily: fonts.fontsType.bold,
                            fontSize: 25,
                            color: colors.primaryColor,
                            marginTop: 20
                        }}>You are doing great!</Text>

                        <Text style={{
                            fontFamily: fonts.fontsType.medium,
                            fontSize: 17,
                            color: 'rgba(49, 40, 2, 0.7)',
                            marginTop: 17,
                            textAlign: 'center'
                        }}>{badgeContent.text}</Text>

                        <CustomButton
                            onPress={() => { setBadgeSheetVisible(false) }}
                            title={'Close'}
                            customStyle={{ marginTop: 30 }}
                        />
                    </View>



                </View>
            </BottomSheet>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent
                headerTitle={'Badges'}
                navigation={navigation}
                navigateTo={'Dashboard'}
                params={{screen:'Setting'}}
                customContainerStyle={{ marginStart: 30 }}
                customTextStyle={{ marginStart: 70 }}
            />
            <Text style={styles.headingTextStyle}>
                Main Stays Badges
            </Text>
            <View style={styles.badgeContainer}>
                <BadgeComponent
                    onPress={() => { setBadgeSheetVisible(true) }}
                    badgeName={'Bronze'}
                    badgeReviewText={'5 reviews min. 4 stars'} />

                <BadgeComponent
                    badgeName={'Silver'}
                    badgeReviewText={'15 reviews min. 4 stars'}
                    customStyle={{ borderColor: '#C0C0C0' }}
                    imageTintColor={'#C0C0C0'}
                    customNameStyle={{ color: '#C0C0C0' }}
                />

            </View>

            <View style={styles.badgeContainer}>
                <BadgeComponent
                    badgeName={'Gold'}
                    badgeReviewText={'25 reviews min. 4 stars'}
                    customStyle={{ borderColor: '#9A9A9A' }}
                    imageTintColor={'#9A9A9A'}
                    customNameStyle={{ color: '#9A9A9A' }}
                />

                <BadgeComponent
                    badgeName={'Platinum'}
                    badgeReviewText={'50 reviews min. 4 stars'}
                    customStyle={{ borderColor: '#9A9A9A' }}
                    imageTintColor={'#9A9A9A'}
                    customNameStyle={{ color: '#9A9A9A' }}
                />

            </View>

            {renderBadgeSheet()}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    headingTextStyle: {
        fontFamily: fonts.fontsType.bold,
        fontSize: 20,
        color: colors.primaryColor,
        alignSelf: 'center',
        marginTop: 50
    },
    badgeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30
    },
    badgeImage: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
});

export default BadgesScreen;
