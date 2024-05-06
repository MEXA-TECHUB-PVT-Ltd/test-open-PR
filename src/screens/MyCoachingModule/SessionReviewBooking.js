//for coachee Session Review Booking
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, Platform } from 'react-native';
import colors from '../../theme/colors';
import HeaderComponent from '../../components/HeaderComponent';
import ProfileCard from '../../components/ProfileCard';
import fonts from '../../theme/fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/ButtonComponent';
import { postSessionStatus } from '../../redux/coachSlices/sessionAcceptRejectSlice';
import moment from 'moment';
import CustomSnackbar from '../../components/CustomToast';
import { resetNavigation } from '../../utilities/resetNavigation';
import ChatIcon from '../../assets/svgs/session_chat_icon.svg'
import { setReceiverId } from '../../redux/setReceiverIdSlice';
import PaymentModal from '../StripePaymentModule/PaymentModal';
import CancleIcon from "../../assets/svgs/cross_icon.svg";
import { BottomSheet } from '@rneui/themed';
import PaymentScreen from '../StripePaymentModule/PaymentScreen.android';

const SessionReviewBooking = ({ navigation, route }) => {
    const { sessionItem } = route.params
    //console.log('sessionItem', sessionItem)
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.sessionAcceptORReject)
    const { role } = useSelector((state) => state.userLogin)
    const { user_id } = useSelector(state => state.userLogin)
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [payload, setPayload] = useState();
    const [showPaymentSheet, setShowPaymentSheet] = useState(false);
    const togglePaymentModal = () => {
        //setPaymentModalVisible(!isPaymentModalVisible);
        setShowPaymentSheet(!showPaymentSheet)
    };

    useEffect(() => {
        const sessionPayload = {
            "coach_id": sessionItem?.session_info?.coach_id,
            "session_id": sessionItem?.session_info?.session_details?.session_id,
            "coachee_id": user_id,
            "amount": sessionItem?.session_info?.session_details?.amount,
            sessionItem: sessionItem
        }
        setPayload(sessionPayload);
    }, [])


    const handlePostSessionStatus = () => {

        const sessionPayload = {
            "coach_id": sessionItem?.session_info?.coach_id,
            "session_id": sessionItem?.session_info?.session_details?.session_id,
            "coachee_id": user_id,
            "amount": sessionItem?.session_info?.session_details?.amount
        }
        setPayload(sessionPayload);
    }


    const renderSuccessMessage = (message) => {
        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')

        setTimeout(() => {
            resetNavigation(navigation, 'CoachingList')
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

    const renderBottomSheet = () => {
        return (
            <BottomSheet modalProps={{}} isVisible={showPaymentSheet}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: '100%',
                        height: hp('55%'),
                        // borderTopEndRadius: 30,
                        // borderTopStartRadius: 30,
                        padding: 10,
                    }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: 10
                    }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: "black",
                                fontFamily: fonts.fontsType.bold,
                            }}>
                            Make Payment
                        </Text>
                        <CancleIcon
                            onPress={() => {
                                togglePaymentModal()
                            }}
                        />
                    </View>


                    <PaymentModal
                        onClose={() => { togglePaymentModal() }}
                        paymentPayload={payload}
                        navigation={navigation}
                    />

                </View>
            </BottomSheet>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <View>
                {renderToastMessage()}
            </View>
            <View style={styles.secondContainer}>

                <HeaderComponent
                    headerTitle={"Review Booking"}
                    navigation={navigation}
                    navigateTo={'CoachingList'}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <ProfileCard
                        profile_pic={sessionItem?.session_info?.coach_profile_pic}
                        first_name={sessionItem?.session_info?.coach_name}
                        last_name={sessionItem?.last_name}
                        rate={sessionItem?.session_info?.coach_avg_rating}
                        status={sessionItem?.session_info?.session_details?.status}
                        chatButtonPress={() => {
                            resetNavigation(navigation, 'ChatScreen')
                            dispatch(setReceiverId({ receiverId: sessionItem?.session_info?.coach_id, role: 'coach' }))
                        }}
                        customContainerStyle={{ flex: 1 }}
                    />
                    {/* <ChatIcon style={{ marginTop: 30 }} onPress={() => {
                        resetNavigation(navigation, 'ChatScreen')
                        dispatch(setReceiverId({ receiverId: sessionItem?.session_info?.coach_id, role:'coach' }))
                    }} /> */}

                </View>
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
                            {sessionItem?.session_info?.coaching_area_name}
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
                            {moment(sessionItem?.session_info?.session_details?.date).format('ddd, MMM DD, YYYY')}
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
                            {sessionItem?.session_info?.session_details?.section}
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
                            {`${sessionItem?.session_info?.session_details?.duration} minutes ($ ${sessionItem?.session_info?.session_details?.amount})`}
                        </Text>
                    </View>

                    {sessionItem?.session_info?.session_details?.status === 'accepted' &&
                        role === 'coachee' &&
                        <CustomButton
                            loading={status == 'loading' ? true : false}
                            onPress={() => {
                                if (Platform.OS == 'android') {
                                    resetNavigation(navigation, "PaymentScreen",
                                        { paymentPayload: payload })
                                } else {
                                    handlePostSessionStatus()
                                    togglePaymentModal()
                                }

                            }}
                            title={'Pay Now!'}
                            customStyle={{ marginTop: hp('20%'), width: wp('90%') }} />}

                </ScrollView>
            </View>
            {renderBottomSheet()}
            {/* <PaymentScreen
                onClose={() => { togglePaymentModal() }}
                paymentPayload={payload}
                navigation={navigation}
            /> */}
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
});

export default SessionReviewBooking;
