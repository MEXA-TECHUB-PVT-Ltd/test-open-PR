//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import CoachSessionListItem from './CoachSessionListItem';
import { resetNavigation } from '../../../utilities/resetNavigation';
import colors from '../../../theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachHomeSessions } from '../../../redux/coachSlices/coachHomeSessionSlice';
import fonts from '../../../theme/fonts';
import ArrowForward from '../../../assets/svgs/see_all_forward_arrow.svg'
import { setCategoryId } from '../../../redux/DashboardSlices/setCategoryIdSlice';
import SessionRequestIcon from '../../../assets/svgs/session_req_icon.svg'
import UpcomingSessionIcon from '../../../assets/svgs/upcoming_icon.svg'
import HomeWelcome from './CoachHomeWelcomeComponent';
import { ActivityIndicator } from 'react-native';
import { setSessionId } from '../../../redux/Sessions/setSessionIdSlice';

const CoachHomeSessionList = ({ navigation, searchQuery }) => {
    const dispatch = useDispatch()
    const { role } = useSelector((state) => state.userLogin);
    const { upcomingSessions, completedSessions, status, error } = useSelector((state) => state.coachHomeSessions)
    const [filteredUpcomingSessions, setFilteredUpcomingSessions] = useState([]);
    const [filteredCompletedSessions, setFilteredCompletedSessions] = useState([]);
    // console.log('upcomingSessions', JSON.stringify(upcomingSessions))
    // console.log('completedSessions', completedSessions)
    // console.log(status)
    // console.log('error', error)


    useEffect(() => {
        dispatch(fetchCoachHomeSessions({ status: "", role: role }))
        dispatch(fetchCoachHomeSessions({ status: "completed", role: role }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    useEffect(() => {
        if (!searchQuery || searchQuery.trim() === '') {
            setFilteredUpcomingSessions(upcomingSessions?.sessions || []);
            setFilteredCompletedSessions(completedSessions?.sessions || []);
        } else {
            setFilteredUpcomingSessions(filterSessions(upcomingSessions?.sessions));
            setFilteredCompletedSessions(filterSessions(completedSessions?.sessions));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, upcomingSessions, completedSessions]);

    const filterSessions = (sessions) => {
        return sessions.filter(session =>
            session?.session_info?.coachee_name && session.session_info.coachee_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };


    const handleNavigation = (item, screenName) => {
        dispatch(setSessionId({
            session_id: item?.session_info?.session_details?.session_id,
            route: 'Dashboard'
        }))
        resetNavigation(navigation, screenName)
    }

    const renderSessions = ({ item }) => (
        <CoachSessionListItem sessionDetail={item} onPress={() => {
            handleNavigation(item, "RequestedSession")
        }} />


    );

    const handleSessionListNav = (status, screenName) => {
        dispatch(setSessionId({ session_status: status }))
        resetNavigation(navigation, screenName)
    }

    return (
        <View>

            {
                status === 'loading' ? <ActivityIndicator color={colors.primaryColor} size={'large'} /> :
                    filteredUpcomingSessions?.length > 0 &&
                        filteredCompletedSessions?.length > 0 ?
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row' }}>

                                <SessionRequestIcon />
                                <Text style={styles.areaNameStyle}>{"Session Request"}</Text>

                                <Text
                                    onPress={() => {
                                        handleSessionListNav("paid", 'SessionRequestedList')
                                    }}
                                    style={styles.seeAllTextStyle}>See All</Text>

                                <ArrowForward width={18} height={18} style={{
                                    alignSelf: 'center'
                                }} />


                            </View>
                            <FlatList
                                data={filteredUpcomingSessions.slice(0, 5)}
                                renderItem={renderSessions}
                                keyExtractor={(item, index) => item?.toString() + index}
                                showsVerticalScrollIndicator={false}
                            />


                            <View style={{ marginVertical: 30 }}>
                                <View style={{ flexDirection: 'row' }}>

                                    <UpcomingSessionIcon />
                                    <Text style={styles.areaNameStyle}>{"Upcoming Sessions"}</Text>

                                    <Text
                                        onPress={() => {
                                            handleSessionListNav("completed", 'SessionRequestedList')
                                        }}
                                        style={styles.seeAllTextStyle}>See All</Text>

                                    <ArrowForward width={18} height={18} style={{
                                        alignSelf: 'center'
                                    }} />


                                </View>
                                <FlatList
                                    data={filteredCompletedSessions.slice(0, 5)}
                                    renderItem={renderSessions}
                                    keyExtractor={(item, index) => item?.toString() + index}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </ScrollView> :
                        <HomeWelcome />

            }



        </View>

    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
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
});

//make this component available to the app
export default CoachHomeSessionList;
