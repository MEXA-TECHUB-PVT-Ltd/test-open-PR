import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView,
    ScrollView, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator
} from 'react-native';
import colors from '../../theme/colors';
import { Badge } from '@rneui/themed';
import HeaderComponent from '../../components/HeaderComponent';
import SessionListIcon from '../../assets/svgs/session_list_icon.svg'
import MonthList from '../../components/MonthList';
import { ButtonGroup } from "@rneui/themed";
import fonts from '../../theme/fonts';
import RateStarIcon from '../../assets/svgs/rate_star_icon.svg'
import { fetchUpcomingAndCompleted } from '../../redux/CoacheeSlices/upcomingAndCompletedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryId } from '../../redux/DashboardSlices/setCategoryIdSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SessionListItem from './Components/SessionListItem';
import CoachSessionListItem from './Components/CoachSessionListItem';
import { setSessionId } from '../../redux/Sessions/setSessionIdSlice';
import EmptyDataView from '../../components/EmptyDataView';

const Presentation = ({ navigation }) => {
    const dispatch = useDispatch();
    const { response, status } = useSelector((state) => state.coacheeUpcomingAndCompleted)
    const { role } = useSelector((state) => state.userLogin)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [postStatus, setPostStatus] = useState('paid');
    //console.log('response', response)

    const numColumns = 2;
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        dispatch(fetchUpcomingAndCompleted({ status: postStatus, role: role }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, postStatus, selectedIndex])

    const handleSetCategoryId = (categoryId, screenName) => {
        dispatch(setCategoryId(categoryId))
        resetNavigation(navigation, screenName)
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                handleSetCategoryId(item?.session_info?.coach_id, "CoachDetail")
            }}
            style={styles.itemContainer}>
            <Image
                style={styles.image}
                source={{ uri: item?.session_info?.coach_profile_pic && item?.session_info?.coach_profile_pic }}
            />
            {/* <View style={styles.overlay}>
                <Text style={styles.overlayText}>Available Today</Text>
            </View> */}
            <View style={{
                flexDirection: 'row',
                // marginStart: 5
            }}>

                <Text style={styles.coachNameStyle}>
                    {`${item?.session_info?.coach_name?.split(' ')[0]}`}
                </Text>
                <Badge
                    badgeStyle={{ backgroundColor: 'black' }}
                    containerStyle={{
                        alignSelf: 'center',
                        marginStart: 5,
                    }} />

                <RateStarIcon
                    width={16}
                    height={16}
                    style={{ alignSelf: 'center', marginStart: 5 }} />

                <Text style={styles.rateStyle}>
                    {`${Math.round(item?.session_info?.coach_avg_rating)}`}
                </Text>
            </View>
            <Text style={styles.categoryTextStyle}>
                {item?.session_info?.coaching_area_name}
            </Text>
            {/* <ScrollView
                // nestedScroll={true} 
                horizontal
                style={{ marginTop: 5, marginStart: 5 }} >
                {item?.coaching_area_names.map((area, index) => (
                    <Text key={index} style={styles.categoryTextStyle}>
                        {area}
                        {index !== item?.coaching_area_names.length - 1 ? ', ' : ''}
                    </Text>
                ))}
            </ScrollView> */}
        </TouchableOpacity>
    );

    const handleNavigation = (item) => {
        const params = {
            sessionItem: item
        }
        resetNavigation(navigation, 'SessionReviewBooking', params)
    }

    const handleCoachNavigation = (item, screenName) => {
        dispatch(setSessionId({
            session_id: item?.session_info?.session_details?.session_id,
            route: 'Dashboard'
        }))
        resetNavigation(navigation, screenName)
    }

    const renderSessions = ({ item }) => (
        (role === 'coachee' ? <SessionListItem sessionDetail={item} onPress={() => {
            handleNavigation(item)
        }} /> : <CoachSessionListItem sessionDetail={item} onPress={() => {
            handleCoachNavigation(item, "SessionDetail")
        }} />)
    );

    const handleSessionListNav = (status, screenName) => {
        dispatch(setSessionId({ session_status: status, route: 'MyCoaching' }))
        resetNavigation(navigation, screenName)
    }


    return (
        <SafeAreaView style={styles.container}>

            <HeaderComponent
                customTextStyle={{ marginStart: 110 }}
                customContainerStyle={{ marginTop: hp('3%') }}
                headerTitle={role === 'coachee' ? "My Coaching"
                    : "My Sessions"}
                icon={
                    <SessionListIcon
                        style={{ marginEnd: 30 }}
                        onPress={() => {
                            //navigation.navigate("SessionRequestedList")
                            if (role === 'coachee') {
                                handleSessionListNav('', 'CoachingList')
                            } else {
                                handleSessionListNav('', 'SessionRequestedList')
                            }

                        }} />
                } />

            <MonthList />

            <ButtonGroup
                buttons={["Upcoming", "Completed"]}
                selectedIndex={selectedIndex}
                onPress={(value) => {
                    setSelectedIndex(value);
                    if (value === 0) {
                        setPostStatus('paid');
                    }
                    else {
                        setPostStatus('completed');
                    }
                }}
                textStyle={{ color: "#8E8E8E", fontSize: 15, fontFamily: fonts.fontsType.medium }}
                innerBorderStyle={{ color: 'white', fontSize: 15, fontFamily: fonts.fontsType.medium }}
                buttonContainerStyle={{ borderRadius: 32 }}
                selectedButtonStyle={{
                    backgroundColor: colors.primaryColor,
                    borderRadius: 32,
                }}
                containerStyle={{
                    marginBottom: 20,
                    backgroundColor: "#F5F5F5",
                    borderRadius: 32,
                    marginTop: 30,
                    marginHorizontal: 40,
                    height: 46,
                }}
            />

            <View style={{
                alignSelf: 'center', flex: 1,
                justifyContent: 'center', alignItems: 'center'
            }}
            >
                {
                    role === 'coachee' ? (
                        status === 'loading' ?
                            <ActivityIndicator size={'large'}
                                color={colors.primaryColor} />
                            :
                            response?.sessions.length > 0 ? <FlatList
                                key={'_'}
                                data={response?.sessions}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString() + item}
                                numColumns={numColumns}
                                showsVerticalScrollIndicator={false}
                            /> : <EmptyDataView message={"Data not available"} />
                    ) :
                        (status === 'loading' ?
                            <ActivityIndicator size={'large'}
                                color={colors.primaryColor} />
                            :
                            <View>
                                {response?.sessions.length > 0 ? <FlatList
                                    key={'#'}
                                    data={response?.sessions}
                                    renderItem={renderSessions}
                                    keyExtractor={(item, index) => index.toString() + item}
                                    showsVerticalScrollIndicator={false}
                                /> : <EmptyDataView message={"Data not available"} />}
                            </View>
                        )

                }

            </View>

        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    itemContainer: {
        // backgroundColor: colors.white,
        // shadowOpacity: 0.05,
        width: 170,
        height: 176,
        position: 'relative',
        marginTop: 10,
        marginEnd: 10,
        borderRadius: 12,

    },
    image: {
        height: 126,
        width: 170,
        borderRadius: 12,
    },
    overlay: {
        position: 'absolute',
        top: hp('10%'),
        left: 8,
        borderRadius: 16,
        backgroundColor: '#1CBA22',
        height: 25,
        width: hp('13%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#029008',
        borderWidth: 1
    },
    overlayText: {
        color: 'white',
        fontFamily: fonts.fontsType.bold,
        fontSize: 11,
        lineHeight: 13
    },
    categoryTextStyle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 13,
        lineHeight: 19,
        color: 'rgba(0, 0, 0, 0.6)'
    },
    seeAllTextStyle: {
        fontFamily: fonts.fontsType.map,
        fontSize: 15,
        lineHeight: 27,
        color: '#312802',
        marginStart: 10,
        alignSelf: 'center'
    },
    areaNameStyle: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 18,
        lineHeight: 27,
        color: colors.primaryColor,
        marginStart: 10,
        alignSelf: 'center',
        flex: 1
    },
    areaIconStyle: {
        width: 20,
        height: 20,
        alignSelf: 'center',
        //tintColor:colors.primaryColor
    },
    rateStyle: {
        fontSize: 13,
        lineHeight: 19,
        fontFamily: fonts.fontsType.regular,
        color: 'rgba(0, 0, 0, 0.6)',
        alignSelf: 'center',
        marginStart: 5
    },
    coachNameStyle: {
        fontSize: 14,
        lineHeight: 21,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.black,
        alignSelf: 'center',

    }
});

export default Presentation;
