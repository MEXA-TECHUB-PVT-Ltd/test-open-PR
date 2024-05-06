import React, { Component, useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, Image,
    ScrollView, TouchableOpacity, ActivityIndicator, Share
} from 'react-native';
import colors from '../../../theme/colors';
import BadgeIcon from '../../../assets/svgs/coach_badge.svg'
import fonts from '../../../theme/fonts';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ForwardIcon from '../../../assets/svgs/forward_icon.svg'
import HorizontalDivider from '../../../components/DividerLine';
import CustomTextComponent from '../../../components/CustomTextComponent';
import EditProfileIcon from '../../../assets/svgs/edit_profile_icon.svg'
import ChangePassIcon from '../../../assets/svgs/pass_change_icon.svg'
import NotificationIcon from '../../../assets/svgs/noti_profile_icon.svg'
import ShareIcon from '../../../assets/svgs/share_icon.svg'
import TermIcon from '../../../assets/svgs/terms_cond_icon.svg'
import RateIcon from '../../../assets/svgs/rate_app_icon.svg'
import InterestIcon from '../../../assets/svgs/interset_icon.svg'
import CustomButton from '../../../components/ButtonComponent';
import LogoutIcon from '../../../assets/svgs/logout_icon.svg'
import { resetNavigation } from '../../../utilities/resetNavigation';
import InAppReview from 'react-native-in-app-review';
import { getData } from '../../../utilities/localStorage';
import { resetState } from '../../../redux/authSlices/userLoginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { removeData } from '../../../utilities/localStorage';
import { fetchUserProfile } from '../../../redux/authSlices/getUserProfileSlice';
import FullScreenLoader from '../../../components/CustomLoader';

const CoacheeSettingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.getUserProfile)
    const { user_id } = useSelector((state) => state.userLogin)
    const [userInfo, setUserInfo] = useState({})


    const shareApp = async () => {
        try {
            const result = await Share.share({
                message: 'Check out this awesome app!',
                url: 'https://your-app-url.com', // Replace with your app's URL
                title: 'MainStays',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared via activity type
                    console.log(`Shared via ${result.activityType}`);
                } else {
                    // Shared
                    console.log('Shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing:', error.message);
        }
    };

    const reviewApp = () => {

        // This package is only available on android version >= 21 and iOS >= 10.3

        // Give you result if version of device supported to rate app or not!
        InAppReview.isAvailable();

        // trigger UI InAppreview
        InAppReview.RequestInAppReview()
            .then((hasFlowFinishedSuccessfully) => {
                // when return true in android it means user finished or close review flow
                console.log('InAppReview in android', hasFlowFinishedSuccessfully);

                // when return true in ios it means review flow lanuched to user.
                console.log(
                    'InAppReview in ios has launched successfully',
                    hasFlowFinishedSuccessfully,
                );

                // 1- you have option to do something ex: (navigate Home page) (in android).
                // 2- you have option to do something,
                // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

                // 3- another option:
                if (hasFlowFinishedSuccessfully) {
                    // do something for ios
                    // do something for android
                }

                // for android:
                // The flow has finished. The API does not indicate whether the user
                // reviewed or not, or even whether the review dialog was shown. Thus, no
                // matter the result, we continue our app flow.

                // for ios
                // the flow lanuched successfully, The API does not indicate whether the user
                // reviewed or not, or he/she closed flow yet as android, Thus, no
                // matter the result, we continue our app flow.
            })
            .catch((error) => {
                //we continue our app flow.
                // we have some error could happen while lanuching InAppReview,
                // Check table for errors and code number that can return in catch.
                console.log(error);
            });
    }

    useEffect(() => {
        const getUserData = async () => {
            const userData = await getData('userData');
            dispatch(fetchUserProfile({
                user_id: userData?.user?.id ? userData?.user?.id : user_id,
                role: userData?.user?.role
            })).then((result) => {
                if (result?.payload?.success === true) {
                    setUserInfo({})
                    setUserInfo(result?.payload)
                }

            })
        }
        getUserData();
    }, [dispatch, user_id])


    function getProfilePicUri(userInfo) {
        return (userInfo?.user?.details?.profile_pic || userInfo?.user?.profile_pic) != null ?
            { uri: (userInfo?.user?.details?.profile_pic || userInfo?.user?.profile_pic) } :
            require('../../../assets/images/user_profile_dummy.png');
    }

    const logOutUser = async () => {
        dispatch(resetState({ token: null }));
        try {
            await removeData("token");
            await removeData('userData');
        } catch (error) {
            console.log(error);
        }
    };

    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.headerStyle}>Settings</Text>
            <ScrollView style={{ marginStart: 20 }}>
            <View style={styles.conatinerProfile}>

                <View style={styles.profileContainer}>
                    <Image
                        resizeMode='cover'
                        source={getProfilePicUri(userInfo)}
                        style={[styles.profileImage]}
                    />
                    <BadgeIcon style={styles.badge} />
                </View>

                <Text style={styles.title}>{`${userInfo?.user?.first_name} ${userInfo?.user?.last_name}`}</Text>
                <Text
                    style={[styles.rateStyle,
                    {
                        marginStart: 0,
                        marginTop: 5
                    }]}>
                    {userInfo?.user?.email}
                </Text>
            </View>
            <View style={styles.badgeContainer}>

                <BadgeIcon width={42} height={42} style={{
                    alignSelf: 'center',
                    marginStart: 20
                }} />

                <View style={styles.badgeHeaderContainer}>
                    <Text style={styles.badgeTextStyle}>Gold Badge</Text>

                    <Text style={styles.coinsTextStyle}>80 Wellcoins</Text>

                </View>

                <ForwardIcon
                    onPress={() => { }}
                    style={{
                        alignSelf: 'center',
                        marginEnd: 20
                    }} />

            </View>

            <HorizontalDivider height={1} customStyle={{ marginTop: 20, width: wp('90%'), alignSelf: 'center' }} />

            
                <CustomTextComponent
                    text="Edit Profile"
                    icon={<EditProfileIcon />}
                    onPress={() => {
                        resetNavigation(navigation, "EditProfile")
                    }}
                />

                <CustomTextComponent
                    text="Change Password"
                    icon={<ChangePassIcon />}
                    onPress={() => {
                        resetNavigation(navigation, "ChangePassword", { email: null })
                    }}
                />

                <CustomTextComponent
                    text="Notification Settings"
                    icon={<NotificationIcon />}
                    onPress={() => {
                        resetNavigation(navigation, 'NotificationSetting')
                    }}
                />

                <CustomTextComponent
                    text="Update Interest"
                    icon={<InterestIcon />}
                    onPress={() => {
                        resetNavigation(navigation, 'UpdateInterest',
                            {
                                role: userInfo?.user?.role,
                                interestAreas: (userInfo?.user?.details?.interests || userInfo?.user?.interests)
                            })
                    }}
                />

                <CustomTextComponent
                    text="Share App"
                    icon={<ShareIcon />}
                    onPress={async () => { shareApp() }}
                />

                <CustomTextComponent
                    text="Rate App"
                    icon={<RateIcon />}
                    onPress={() => { reviewApp() }}
                />

                <CustomTextComponent
                    text="Privacy Policy"
                    icon={<ChangePassIcon />} />

                <CustomTextComponent
                    text="Terms & Conditions"
                    icon={<TermIcon />} />

                <View style={styles.buttonStyle}>
                    <TouchableOpacity style={[styles.button]}
                        onPress={() => { logOutUser() }}>
                        {false ? <ActivityIndicator size="small" color="#ffffff" /> :
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <LogoutIcon style={{ marginRight: 10, alignSelf: 'center' }} />
                                <Text style={[styles.buttonText]}>{'Logout'}</Text>
                            </View>
                        }
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    profileContainer: {
        position: 'relative',
        backgroundColor: '#F6F6F6',
        width: 75,
        height: 75,
        borderRadius: 35,
        justifyContent: 'center'
    },
    profileImage: {
        width: 75,
        height: 75,
        borderRadius: 35,
        alignSelf: 'center',
    },
    badge: {
        position: 'absolute',
        bottom: -8,
        right: 0,
    },
    title: {
        fontSize: 17,
        fontFamily: fonts.fontsType.bold,
        color: colors.primaryColor,
        marginTop: 15
    },
    rateStyle: {
        fontSize: 13,
        fontFamily: fonts.fontsType.medium,
        color: colors.blackTransparent,

    },
    headerStyle: {
        color: '#312802',
        fontSize: 23,
        fontFamily: fonts.fontsType.semiBold,
        lineHeight: 47,
        alignSelf: 'center'
    },
    conatinerProfile: {
        alignItems: 'center',
        marginTop: hp('3%')
    },
    badgeHeaderContainer: {
        alignSelf: 'center',
        marginStart: 15,
        marginTop: 5,
        flex: 1
    },
    badgeTextStyle: {
        fontFamily: fonts.fontsType.bold,
        color: colors.white,
        fontSize: 17,
        lineHeight: 27,

    },

    coinsTextStyle: {
        fontFamily: fonts.fontsType.medium,
        color: colors.white,
        fontSize: 13,
        lineHeight: 25,

    },
    badgeContainer: {
        width: wp('90%'),
        height: hp('9%'),
        backgroundColor: colors.primaryColor,
        alignSelf: 'center',
        borderRadius: 14,
        marginTop: 15,
        flexDirection: 'row'
    },
    button: {
        backgroundColor: 'rgba(15, 109, 106, 1)',
        borderRadius: 30,
        width: '95%',
        height: 45,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    buttonText: {
        color: 'rgba(255, 255, 255, 1)',
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 16,
        textAlign: 'center',
    },
    buttonStyle: { marginTop: 20 },
});


export default CoacheeSettingScreen;
