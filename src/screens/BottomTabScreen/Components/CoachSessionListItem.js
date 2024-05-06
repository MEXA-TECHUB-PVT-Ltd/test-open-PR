import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '../../../theme/colors';
import BadgeIcon from '../../../assets/svgs/coach_badge.svg'
import fonts from '../../../theme/fonts';
import HorizontalDivider from '../../../components/DividerLine';
import moment from 'moment';
import { useSelector } from 'react-redux';

const CoachSessionListItem = ({ sessionDetail, onPress }) => {
    const { role } = useSelector((state) => state.userLogin);

    const getStatus = (status) => {
        if (status === 'pending') {
            return 'Pending'
        }
        if (status === 'completed') {
            return 'Accepted'
        }

        if (status === 'rejected') {
            return 'Rejected'
        }
    }

    return (
        <TouchableOpacity onPress={onPress} style={{ marginTop: 20 }}>

            <View style={{ flexDirection: 'row' }}>

                <View>

                    <View style={styles.profileContainer}>
                        <Image
                            resizeMode='cover'
                            source={{
                                uri: sessionDetail?.session_info?.coachee_profile_pic || 'https://via.placeholder.com/150' // Placeholder image URL
                            }}
                            style={[styles.profileImage]}
                        />
                        <BadgeIcon width={20} height={20} style={styles.badge} />
                    </View>

                </View>

                <View style={{ flex: 1, marginTop: 10, marginStart: 10 }}>

                    <Text style={styles.title}>{sessionDetail?.session_info?.coachee_name}</Text>

                    <Text style={[styles.rateStyle]}>
                        {`${sessionDetail?.session_info?.coaching_area_name} - ${sessionDetail?.session_info?.session_details?.duration} min`}
                    </Text>
                </View>

                <View style={{ marginTop: 25, alignSelf: 'center' }}>

                    {/* <Text
                        style={[styles.title,
                        {
                            fontSize: 13,
                            color: sessionDetail?.session_info?.session_details?.status === 'pending' ?
                                '#D88200' : sessionDetail?.session_info?.session_details?.status === 'completed' ?
                                    '#00BB34' : '#FF0000',
                            textAlign: 'right'
                        }]}>
                        {getStatus(sessionDetail?.session_info?.session_details?.status)}
                    </Text> */}

                    <Text style={[styles.rateStyle]}>
                        {`${moment(sessionDetail?.session_info?.session_details?.date).format('DD MMM')}, ${sessionDetail?.session_info?.session_details?.section}`}
                    </Text>
                </View>

            </View>

            <HorizontalDivider
                height={1}
                customStyle={{ marginTop: 20, width: 320, marginStart: 10 }} />

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    profileContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    badge: {
        position: 'absolute',
        bottom: -8,
        right: 0,
    },
    title: {
        fontSize: 15,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.black
    },
    rateStyle: {
        fontSize: 13,
        fontFamily: fonts.fontsType.regular,
        color: colors.blackTransparent,
        marginTop: 10,
    },
});

//make this component available to the app
export default CoachSessionListItem;
