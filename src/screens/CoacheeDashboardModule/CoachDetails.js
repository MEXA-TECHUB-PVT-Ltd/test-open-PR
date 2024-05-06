import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import HeaderComponent from '../../components/HeaderComponent';
import { BottomSheet } from '@rneui/themed';
import BadgeIcon from '../../assets/svgs/coach_badge.svg'
import ProfileCard from '../../components/ProfileCard';
import fonts from '../../theme/fonts';
import CancleIcon from "../../assets/svgs/cross_icon.svg";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HorizontalDivider from '../../components/DividerLine';
import MultiSelectAreas from '../../components/MultiSelectAreas';
import CustomCalendar from '../../components/CustomCalendar';
import CustomTimeSlots from '../../components/CustomTimeSlots';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachDetail } from '../../redux/DashboardSlices/getSingleCoachDetailSlice';
import { fetchCoachSection } from '../../redux/DashboardSlices/getSectionByCoachSlice';
import { fetchSessionDurations } from '../../redux/DashboardSlices/getDurationSlice';
import CustomButton from '../../components/ButtonComponent';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomSnackbar from '../../components/CustomToast';
import { resetNavigation } from '../../utilities/resetNavigation';
import { setReceiverId } from '../../redux/setReceiverIdSlice';

const schedule = {
    Monday: {
        enabled: true, timeSessions: [
            { start: "12:00 pm", end: "6:00 am" },
            { start: "11:00 pm", end: "6:00 am" },
            { start: "07:00 pm", end: "6:00 am" }
        ]
    },
    Tuesday: { enabled: false, timeSessions: [] },
    Wednesday: { enabled: false, timeSessions: [] },
    Thursday: { enabled: false, timeSessions: [] },
    Friday: { enabled: false, timeSessions: [] },
    Saturday: {
        enabled: true, timeSessions: [
            { start: "12:00 pm", end: "6:00 am" },
            { start: "09:00 pm", end: "6:00 am" },
            { start: "10:00 pm", end: "6:00 am" }
        ]
    },
    Sunday: { enabled: false, timeSessions: [] },
};

const CoachDetails = ({ navigation }) => {
    const dispatch = useDispatch();
    const { coachDetails, status, error } = useSelector((state) => state.getCoachDetail)
    const { coachSections } = useSelector((state) => state.coachSection)
    const { durations } = useSelector((state) => state.durations)
    const coachId = useSelector((state) => state.categoryId.categoryId)
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [durationSheetVisible, setDurationSheetVisible] = useState(false);
    const [selectDurations, setSelectedDuration] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const [showFullDescription, setShowFullDescription] = useState(false);
    console.log('durations', durations)
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };
    console.log('coachId', coachId)
    //console.log('coachDetails', JSON.stringify(coachDetails))
    //console.log('coachSections', JSON.stringify(coachSections))
    // console.log('status', status)
    // console.log('error', error)
    // console.log('coachId', coachId)

    function getEnabledDays(payload) {
        // Check if payload is empty
        if (!payload || Object.keys(payload).length === 0) {
            console.log("Payload is empty.");
            return [];
        }

        const enabledDays = [];
        for (const day in payload) {
            if (payload[day].enabled) {
                enabledDays.push(day);
            }
        }

        return enabledDays;
    }



    useEffect(() => {
        dispatch(fetchCoachDetail({ coachId: coachId, chatRole: 'coach' }))
        dispatch(fetchCoachSection({ coachId: coachId }))
        dispatch(fetchSessionDurations({ coachId: coachId }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, coachId])

    const handleAreaSelection = (selectedAreas) => {
        setSelectedAreas(selectedAreas);
    };


    // Function to get array of start times for a selected day
    function getStartTimesForDay(schedule, selectedDay) {
        const startTimes = [];
        if (schedule[selectedDay] && schedule[selectedDay].enabled) {
            schedule[selectedDay].timeSessions.forEach(session => {
                startTimes.push(session.start);
            });
        }
        return startTimes;
    }

    const highlightedDates = {
        '2024-04-27': { marked: true, dotColor: 'green' },
        '2024-04-29': { marked: true, dotColor: 'green' },
    };

    const handleSelectDate = (date, selectedDay) => {
        setSelectedDate(date);
        const startTimes = getStartTimesForDay(coachSections?.sections?.section_list[0]?.section_details
            && coachSections?.sections?.section_list[0]?.section_details, selectedDay);
        setTimeSlots(startTimes)
    };



    const handleSelectTime = (time) => {
        setSelectedTime(time);
    };

    const handleCheckboxClick = duration => {
        setSelectedDuration([duration]);
    };

    // console.log('selectDurations', selectDurations)
    // console.log('selectedAreas', selectedAreas)
    // console.log('day', selectedDate)
    // console.log('selectedTime', selectedTime)

    // const handleCheckboxClick = languageId => {
    //     const isSelected = selectDurations.includes(languageId);
    //     if (isSelected) {
    //         setSelectedDuration(prevSelected =>
    //             prevSelected.filter(id => id !== languageId),
    //         );
    //     } else {
    //         setSelectedDuration(prevSelected => [...prevSelected, languageId]);
    //     }
    // };

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

    const handleReviewSession = () => {

        if (selectDurations.length === 0) {
            renderErrorMessage('Select atleast one duration.')
            return;
        }

        const sessionPayload = {
            coach_id: coachId,
            date: selectedDate,
            duration: selectDurations[0].value,
            section: selectedTime,
            coaching_area_id: selectedAreas[0].areaId,
            amount: selectDurations[0].amount,
            profile_pic: coachDetails?.details?.profile_pic || coachDetails?.profile_pic,
            first_name: coachDetails?.first_name,
            last_name: coachDetails?.last_name,
            cateory: selectedAreas[0]?.area,
        }
        setDurationSheetVisible(false)
        navigation.navigate('ReviewBooking', { sessionPayload: sessionPayload })
    }

    const renderDuration = (item, index) => {
        item?.amount > 0 && <View key={index} style={{ margin: 8 }}>
            <View
                style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
                <Text
                    style={{
                        flex: 1,
                        fontFamily: fonts.fontsType.medium,
                        fontSize: 17,
                        color: "rgba(115, 115, 115, 1)",
                        lineHeight: 29,
                    }}>
                    {`${item?.value} Minutes (CHF ${item?.amount && item?.amount || 0})`}
                </Text>
                <CustomCheckbox
                    checkedColor="rgba(15, 109, 106, 1)"
                    uncheckedColor="rgba(238, 238, 238, 1)"
                    onToggle={() => {
                        handleCheckboxClick(item);
                    }}
                />
            </View>
            <HorizontalDivider height={1} customStyle={{ marginTop: 5 }} />
        </View>
    }


    const renderDurationSheet = () => {
        return (
            <BottomSheet modalProps={{}} isVisible={durationSheetVisible}>

                <View
                    style={{
                        backgroundColor: "#fff",
                        width: '100%',
                        height: hp('50%'),
                        borderTopEndRadius: 16,
                        borderTopStartRadius: 16,
                        padding: 20,
                    }}>

                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: "rgba(49, 40, 2, 1)",
                                fontFamily: fonts.fontsType.semiBold,
                            }}>
                            Choose Duration
                        </Text>
                        <CancleIcon
                            onPress={() => {
                                setDurationSheetVisible(false);
                            }}
                        />
                    </View>

                    <ProfileCard
                        profile_pic={coachDetails?.details?.profile_pic ||
                            coachDetails?.profile_pic}
                        first_name={coachDetails?.first_name}
                        last_name={coachDetails?.last_name}
                        customContainerStyle={{ marginTop: 20 }}
                        areas={selectedAreas[0]?.area}
                        isChatButton={false}
                        customProfileImageStyle={{
                            width: 55,
                            height: 55,
                            borderRadius: 25,
                        }}
                    />
                    {renderToastMessage()}

                    <View style={{ padding: 10, }}>


                        <ScrollView>
                            {
                                durations?.duration?.details.map((item, index) =>
                                    renderDuration(item, index)
                                )
                            }
                        </ScrollView>


                        {/* <FlatList
                            data={durations?.duration?.details}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderDuration}
                            keyExtractor={(item, index) => index + item}
                        /> */}

                        <CustomButton
                            onPress={() => {
                                handleReviewSession()
                            }}
                            title={'Continue'}
                            customStyle={{ marginTop: 25 }} />
                    </View>


                </View>
            </BottomSheet>
        );
    };

    const handleRequestSessionButton = () => {
        // console.log(selectedTime)
        // if (selectedAreas.length === 0 || selectedTime == null) {
        //     renderErrorMessage('Category and Time Slot is required.')
        //     return
        // }
        setDurationSheetVisible(true)
    }

    const handleChatNavigation = () => {
        resetNavigation(navigation, 'ChatScreen')
        dispatch(setReceiverId({ receiverId: coachId, role: 'coach' }))
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.secondContainer}>
                <HeaderComponent
                    headerTitle={"Coach's Detail"}
                    navigation={navigation}
                    navigateTo={'Dashboard'}
                    customContainerStyle={{ marginTop: 0 }}
                />

                <ProfileCard
                    profile_pic={coachDetails?.details?.profile_pic || coachDetails?.profile_pic}
                    first_name={coachDetails?.first_name}
                    last_name={coachDetails?.last_name}
                    chatButtonPress={() => {
                        handleChatNavigation()
                    }}
                    customContainerStyle={{}}
                    isChatButton={true}
                />
                {/* {renderToastMessage()} */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{}}>

                    <View style={{ marginTop: 30 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            Category
                        </Text>
                        <ScrollView horizontal style={{ flexDirection: 'row', }}>

                            {coachDetails?.coaching_areas ? coachDetails?.coaching_areas?.map((areas, index) => {

                                return <Text key={index} style={{
                                    fontSize: 14,
                                    fontFamily: fonts.fontsType.medium,
                                    lineHeight: 27,
                                    color: colors.blackTransparent
                                }}>
                                    {areas}
                                    {index !== coachDetails?.coaching_areas?.length - 1 ? ', ' : ''}
                                </Text>

                            }) : <Text style={{
                                fontSize: 14,
                                fontFamily: fonts.fontsType.medium,
                                lineHeight: 27,
                                color: colors.blackTransparent
                            }}>
                                N/A
                            </Text>}

                        </ScrollView>

                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            Languages
                        </Text>
                        <View style={{ flexDirection: 'row', width: wp('80%') }}>

                            {coachDetails?.languages ? coachDetails?.languages?.map((language, index) => {

                                return <Text key={index} style={{
                                    fontSize: 14,
                                    fontFamily: fonts.fontsType.medium,
                                    lineHeight: 27,
                                    color: colors.blackTransparent
                                }}>
                                    {language}
                                    {index !== coachDetails?.languages?.length - 1 ? ', ' : ''}
                                </Text>

                            }) : <Text style={{
                                fontSize: 14,
                                fontFamily: fonts.fontsType.medium,
                                lineHeight: 27,
                                color: colors.blackTransparent
                            }}>
                                N/A
                            </Text>}

                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 16,
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
                            {/* {coachDetails?.about ? coachDetails?.about : 'N/A'} */}
                            {showFullDescription
                                ? coachDetails?.about
                                : `${(coachDetails?.about?.length > 90 ? coachDetails?.about?.slice(0, 90)
                                    : coachDetails?.about)}...`}
                        </Text>

                        {(
                            <TouchableOpacity onPress={toggleDescription}>
                                <Text
                                    style={{
                                        color: colors.primaryColor,
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: 15,
                                        alignSelf: 'flex-end',
                                    }}>
                                    {!showFullDescription ? 'See More' : "See Less"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <HorizontalDivider customStyle={{ marginTop: 20 }} />

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            Select Category
                        </Text>
                        <MultiSelectAreas
                            areas={coachSections?.sections?.coaching_area_list}
                            selectedAreas={selectedAreas}
                            onSelect={handleAreaSelection}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            Booking Availability
                        </Text>
                        <CustomCalendar
                            initialSelectedDate={selectedDate}
                            highlightedDayNames={getEnabledDays(coachSections?.sections?.section_list[0]?.section_details)}
                            onSelectDate={handleSelectDate}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            Select Time
                        </Text>

                        <CustomTimeSlots
                            times={timeSlots}
                            selectedTime={selectedTime}
                            onSelectTime={handleSelectTime}
                        />
                    </View>


                    <CustomButton
                        onPress={() => {
                            handleRequestSessionButton()
                        }}
                        title={'Request Session'}
                        customStyle={{ marginTop: 40, width: wp('90%') }} />
                </ScrollView>
            </View>

            {renderDurationSheet()}

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

export default CoachDetails;
