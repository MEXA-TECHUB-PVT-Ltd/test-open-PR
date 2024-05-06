//for Coach Requested Session Detail of Coachee
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native';
import colors from '../../theme/colors';
import HeaderComponent from '../../components/HeaderComponent';
import ProfileCard from '../../components/ProfileCard';
import fonts from '../../theme/fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/ButtonComponent';
import { postSessionStatus } from '../../redux/coachSlices/sessionAcceptRejectSlice';
import moment from 'moment';
import BadgeIcon from '../../assets/svgs/coach_badge.svg'
import CustomSnackbar from '../../components/CustomToast';
import { resetNavigation } from '../../utilities/resetNavigation';
import { fetchSessionDetailById } from '../../redux/Sessions/getSessionByIdSlice';
import ChatIcon from '../../assets/svgs/session_chat_icon.svg'
import { setReceiverId } from '../../redux/setReceiverIdSlice';
const RequestedSessionDetail = ({ navigation, route }) => {
    //const { sessionItem } = route.params
    //console.log('sessionItem', sessionItem)
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.sessionAcceptORReject)
    const sessionStatus = useSelector((state) => state.sessionDetailById.status)
    const { sessionId } = useSelector((state) => state.setSessionId)
    const { role } = useSelector((state) => state.userLogin)
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const [sessionDetail, setSessionDetail] = useState({});
    console.log('test', sessionDetail)

    useEffect(() => {
        dispatch(fetchSessionDetailById({ sessionId: sessionId?.session_id })).then((result) => {
            if (result?.payload?.success === true) {

                setSessionDetail(result?.payload?.session?.session_data)
            }
        })
    }, [dispatch, sessionId])

    const handlePostSessionStatus = (sessionSatus) => {

        const sessionPayload = {
            status: sessionSatus,
            sessionId: sessionId?.session_id
        }
        dispatch(postSessionStatus(sessionPayload)).then((result) => {
            if (result?.payload?.success === true) {
                renderSuccessMessage("Request submitted successfully")
            }
            else {
                renderErrorMessage(result?.payload?.message)
            }
        })
    }


    const renderSuccessMessage = (message) => {
        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')

        setTimeout(() => {
            resetNavigation(navigation, sessionId?.route)
        }, 3000);

    }

    const renderErrorMessage = (message) => {
        setMessage('Error')
        setDescription(message)
        setIsVisible(true);
        setToastType('error')
    }

    const renderToastMessage = () => {
        return <CustomSnackbar visible={isVisible} message={message}
            messageDescription={description}
            onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
    }

    if (sessionStatus === 'loading') {
        return <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={colors.primaryColor} size={'large'} />
        </View>
    }

    const getStatus = (status) => {
        if (status === 'pending') {
            return 'Pending'
        }
        if (status === 'completed') {
            return 'Completed'
        }

        if (status === 'accepted') {
            return 'Accepted'
        }

        if (status === 'paid') {
            return 'Upcoming'
        }

        if (status === 'rejected') {
            return 'Rejected'
        }
    }

    const renderProfile = () => {
        return <View style={[styles.conatinerProfile]}>
            <View style={styles.profileContainer}>
                <Image
                    resizeMode='cover'
                    source={{
                        uri: sessionDetail?.coachee?.profile_pic || 'https://via.placeholder.com/150' // Placeholder image URL
                    }}
                    style={[styles.profileImage]}
                />
                <BadgeIcon style={styles.badge} />
            </View>
            <View style={{ marginStart: 15, flex: 1 }}>
                <Text style={styles.title}>{`${sessionDetail?.coachee?.name}`}</Text>

                {/* <Text style={styles.rateStyle}>{`${''}`}</Text> */}

                {sessionDetail?.session_details?.status && <Text
                    style={[styles.statusTitle,
                    {
                        fontSize: 13,
                        marginTop: 10,
                        color: sessionDetail?.session_details?.status === 'pending' ?
                            '#D88200' : sessionDetail?.session_details?.status === 'completed' ||
                                sessionDetail?.session_details?.status === 'accepted' ||
                                sessionDetail?.session_details?.status === 'paid' ?
                                '#00BB34' : sessionDetail?.session_details?.status === 'rejected' ? '#FF0000' : 'white',
                    }]}>
                    {getStatus(sessionDetail?.session_details?.status)}
                </Text>}
            </View>

            <ChatIcon width={55} height={55} onPress={() => {
                resetNavigation(navigation, 'ChatScreen')
            }} />

        </View>
    }



    return (
        <SafeAreaView style={styles.container}>
            {/* <View>
                {renderToastMessage()}
            </View> */}
            <View style={styles.secondContainer}>

                <HeaderComponent
                    headerTitle={sessionDetail?.session_details?.status === 'completed' ||
                        sessionDetail?.session_details?.status === 'accepted'
                        ? "Session Details" : "Request Details"}
                    navigation={navigation}
                    navigateTo={sessionId?.route}
                />

                {renderToastMessage()}

                {renderProfile()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{}}>

                    <View style={{ marginTop: 30 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.medium,
                            lineHeight: 27,
                            color: colors.blackTransparent
                        }}>
                            Category
                        </Text>
                        <Text style={{
                            fontSize: 18,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {sessionDetail?.coaching_area_name}
                        </Text>

                    </View>


                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.medium,
                            lineHeight: 27,
                            color: colors.blackTransparent
                        }}>
                            Date
                        </Text>

                        <Text style={{
                            fontSize: 18,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {moment(sessionDetail?.session_details?.date).format('ddd, MMM DD, YYYY')}
                        </Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.medium,
                            lineHeight: 27,
                            color: colors.blackTransparent
                        }}>
                            Time
                        </Text>

                        <Text style={{
                            fontSize: 18,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {sessionDetail?.session_details?.section}
                        </Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.medium,
                            lineHeight: 27,
                            color: colors.blackTransparent
                        }}>
                            Session Type
                        </Text>

                        <Text style={{
                            fontSize: 18,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {`${sessionDetail?.session_details?.duration} minutes ($ ${sessionDetail?.session_details?.amount})`}
                        </Text>
                    </View>

                    {
                        sessionDetail?.session_details?.status === 'pending' &&
                        <View style={{ marginTop: hp('15%') }}>
                            <CustomButton
                                loading={status == 'loading' ? true : false}
                                onPress={() => {
                                    handlePostSessionStatus("accepted")
                                }}
                                title={'Accept Request'}
                                customStyle={{}} />

                            <CustomButton
                                loading={status == 'loading' ? true : false}
                                onPress={() => {
                                    handlePostSessionStatus("rejected")
                                }}
                                title={'Reject Request'}
                                customStyle={{
                                    marginTop: hp('-3%'),
                                    backgroundColor: colors.transparent
                                }}
                                textCustomStyle={{ color: colors.primaryColor }} />
                        </View>
                    }
                    {
                        sessionDetail?.session_details?.status === 'paid' &&
                        <View style={{ marginTop: hp('15%') }}>
                            <CustomButton
                                onPress={() => {

                                }}
                                title={'Start Session'}
                                customStyle={{}} />
                        </View>
                    }
                </ScrollView>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    secondContainer: {
        margin: 20,
        flex: 1
    },

    conatinerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50
    },
    profileContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 35,
    },
    badge: {
        position: 'absolute',
        bottom: -8,
        right: 0,
    },
    title: {
        fontSize: 19,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.primaryColor,
    },
    rateStyle: {
        fontSize: 17,
        fontFamily: fonts.fontsType.regular,
        color: colors.blackTransparent,
        marginStart: 5
    },
    ratingContainer: {
        flexDirection: 'row',

    },
    statusTitle: {
        fontSize: 15,
        fontFamily: fonts.fontsType.semiBold,
    },
});

export default RequestedSessionDetail;
