//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../../theme/colors';
import HeaderComponent from '../../../components/HeaderComponent';
import ProfileCard from '../../../components/ProfileCard';
import HorizontalDivider from '../../../components/DividerLine';
import fonts from '../../../theme/fonts';
import ProfileItem from '../Components/MyProfileItemContainer';
import CoachingAreaIcon from '../../../assets/svgs/coaching_areas_icon.svg'
import LanguageIcon from '../../../assets/svgs/languages_icon.svg'
import AvailabilityIcon from '../../../assets/svgs/availablity_icon.svg'
import SessionDurationIcon from '../../../assets/svgs/session_duration_icon.svg'
import EditIcon from '../../../assets/svgs/eidt_icon_profile.svg'
import { fetchUserProfile } from '../../../redux/authSlices/getUserProfileSlice';
import { useDispatch, useSelector } from 'react-redux';
import FullScreenLoader from '../../../components/CustomLoader';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { resetNavigation } from '../../../utilities/resetNavigation';
import { setAnyData, setUserId } from '../../../redux/setAnyTypeDataSlice';


const CoachMyProfile = ({ navigation }) => {
    const dispatch = useDispatch();
    const { status, user } = useSelector((state) => state.getUserProfile);
    const { user_id } = useSelector((state) => state.anyData);
    const [showFullDescription, setShowFullDescription] = useState(false);
    console.log('user_id', user_id)

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    useEffect(() => {
        //if any issue fetching user data then send role from here in payload
        dispatch(fetchUserProfile({ user_id: user_id }))
    }, [dispatch, user_id])

    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }

    const handleNavigation = (screen, tobeUpdatedData, user_id) => {
        if (user_id) {
            dispatch(setUserId({ user_id: user_id }))
        } else {
            dispatch(setAnyData({ anyData: tobeUpdatedData }))
        }

        resetNavigation(navigation, screen)
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={{ margin: 30, }}>
               
            </View> */}
            <HeaderComponent
                navigation={navigation}
                navigateTo={'Dashboard'}
                params={{ screen: 'Setting' }}
                headerTitle={'My Profile'}
                customTextStyle={{ marginStart: 70 }}
                customContainerStyle={{ marginStart: 20 }} />
            <ScrollView>
                <View style={{ margin: 30, marginTop: hp('-0.5%') }}>


                    <ProfileCard
                        profile_pic={user?.user?.details?.profile_pic || user?.user?.profile_pic}
                        first_name={user?.user?.first_name}
                        last_name={user?.user?.last_name}
                        customContainerStyle={{ top: 0 }}
                        areas={user?.user?.details?.coaching_areas || user?.user?.coaching_areas}
                    //specialized={'Vegan Nutrition Specialist'}
                    />

                    <HorizontalDivider height={1} customStyle={{ marginTop: 25 }} />

                    <View style={{ marginTop: 15 }}>
                        <Text style={{
                            fontSize: 19,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            About
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.medium,
                            lineHeight: 27,
                            color: colors.blackTransparent,

                        }}>
                            {showFullDescription
                                ? user?.user?.details?.about || user?.user?.about
                                : `${user?.user?.details?.about.slice(0, 165) || user?.user?.about.slice(0, 165)}...`}
                        </Text>
                        {(
                            <TouchableOpacity onPress={toggleDescription}>
                                <Text style={{
                                    color: colors.primaryColor,
                                    fontFamily: fonts.fontsType.medium, fontSize: 15, alignSelf: 'flex-end'
                                }}>
                                    {!showFullDescription ? 'See More' : "See Less"}
                                </Text>
                            </TouchableOpacity>
                        )}

                    </View>

                    <ProfileItem
                        onPress={() => {
                            handleNavigation('UpdateCoachingAreas',
                                user?.user?.details?.coaching_areas || user?.user?.coaching_areas)
                        }}
                        headerText="Coaching Areas"
                        subHeaderText={user?.user?.details?.coaching_areas || user?.user?.coaching_areas}
                        icon={<CoachingAreaIcon style={{
                            alignSelf: 'center',
                            marginStart: 20
                        }} />}
                        editIcon={<EditIcon style={{
                            alignSelf: 'center',
                            marginEnd: 20
                        }} />}
                    />

                    <ProfileItem
                        onPress={() => {
                            handleNavigation('UpdateLanguages',
                                user?.user?.details?.languages || user?.user?.languages)
                        }}
                        headerText="Languages"
                        subHeaderText={user?.user?.details?.languages || user?.user?.languages}
                        icon={<LanguageIcon style={{
                            alignSelf: 'center',
                            marginStart: 20
                        }} />}
                        editIcon={<EditIcon style={{
                            alignSelf: 'center',
                            marginEnd: 20
                        }} />}
                    />

                    <ProfileItem
                        onPress={() => {
                            handleNavigation('UpdateAvailability', null,
                                user?.user?.id)
                        }}
                        headerText="Availability"
                        icon={<AvailabilityIcon style={{
                            alignSelf: 'center',
                            marginStart: 20
                        }} />}
                    />

                    <ProfileItem
                        onPress={() => {
                            handleNavigation('UpdateSessionDurations', null,
                                user?.user?.id)
                        }}
                        headerText="Session’s Duration"
                        icon={<SessionDurationIcon style={{
                            alignSelf: 'center',
                            marginStart: 20
                        }} />}
                    />


                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});

//make this component available to the app
export default CoachMyProfile;
