import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import Swipeable from 'react-native-swipeable-row';
import fonts from '../../../theme/fonts';
import colors from '../../../theme/colors';
import DeleteIcon from '../../../assets/svgs/list_delete_icon.svg'
import ReportIcon from '../../../assets/svgs/list_report_icon.svg'
import moment from 'moment';
import { resetNavigation } from '../../../utilities/resetNavigation';
import { setReceiverId } from '../../../redux/setReceiverIdSlice';
import { useDispatch, useSelector } from 'react-redux';

const ChatUserItem = ({ user, onDeletePress, onReportPress, navigation }) => {
    const dispatch = useDispatch();
    const { role } = useSelector(state => state.userLogin)
    const [isSwiped, setIsSwiped] = useState(false);
    const swipeableRef = useRef(null);
    const getTimeDifference = (timestamp) => {
        const now = moment();
        const diffInSeconds = now.diff(timestamp, 'seconds');

        if (diffInSeconds >= 60) {
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes >= 60) {
                const diffInHours = Math.floor(diffInMinutes / 60);
                if (diffInHours >= 24) {
                    const diffInDays = Math.floor(diffInHours / 24);
                    if (diffInDays >= 7) {
                        const diffInWeeks = Math.floor(diffInDays / 7);
                        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
                    } else {
                        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
                    }
                } else {
                    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
                }
            } else {
                return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
            }
        } else {
            return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
        }
    };

    const handleSwipeClose = () => {
        setIsSwiped(false);
    };


    const handleNavigation = (contact_id) => {
        resetNavigation(navigation, 'ChatScreen')
        dispatch(setReceiverId({ receiverId: contact_id, role: role === 'coach' ? 'coachee' : 'coach' }))
    }
    const handleDeletePress = (contact_id) => {
        onDeletePress(contact_id);
        if (swipeableRef.current) {
            swipeableRef.current.recenter(); // Close swipeable row
        }
    };

    const handleReportPress = (contact_id) => {
        onReportPress(contact_id)
        if (swipeableRef.current) {
            swipeableRef.current.recenter(); // Close swipeable row
        }
    };

    return (
        <Swipeable
            ref={swipeableRef}
            rightButtons={[
                // <ReportIcon style={{ marginTop: 25, marginLeft: 20 }} onPress={() => onInfo(user.id)} />,
                <TouchableOpacity onPress={() => {
                    handleReportPress(user?.contact_id)
                }
                }>
                    <Image
                        style={{ width: 36, height: 36, marginTop: 25, marginLeft: 20 }}
                        source={require('../../../assets/images/report_img.png')} />
                </TouchableOpacity>,

                <TouchableOpacity onPress={() => {
                    handleDeletePress(user?.contact_id)
                }}>
                    <DeleteIcon style={{ marginTop: 25, }} />
                </TouchableOpacity>,

            ]}

            onSwipeClose={handleSwipeClose}

        //swipeStartMinDistance={50} 
        >
            <TouchableOpacity onPress={() => {
                handleNavigation(user?.contact_id)
            }}>
                <ListItem
                    //bottomDivider
                    containerStyle={{
                        backgroundColor: isSwiped ? 'rgba(220, 235, 235, 1)' : 'transparent',
                        marginTop: -10
                    }}>
                    <View style={{ position: 'relative' }}>
                        <Image
                            source={{ uri: user?.profile_pic || "https://via.placeholder.com/150?text=" }}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                        {user?.isOnline && (
                            <View
                                style={{
                                    position: 'absolute',
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgba(15, 225, 109, 1)',
                                    borderWidth: 2,
                                    borderColor: 'white',
                                    bottom: 4,
                                    right: -2,
                                }}
                            />
                        )}
                    </View>
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>{`${user?.contact_first_name} ${user.contact_last_name}`}</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtitle}>{user?.last_message}</ListItem.Subtitle>
                    </ListItem.Content>
                    <View style={{ alignItems: 'flex-end' }}>
                        {/* <Text style={styles.recentTime}>{moment(user?.last_message_timestamp).format('h:mm A')}</Text> */}
                        <Text style={[styles.recentTime]}>{getTimeDifference(user?.last_message_timestamp)}</Text>

                        {<View style={styles.messageContainer}>
                            <Text style={styles.messageCount}>{user?.messageCount}</Text>
                        </View>}

                        {/* {user?.messageCount > 0 && <View style={styles.messageContainer}>
                            <Text style={styles.messageCount}>{user?.messageCount}</Text>
                        </View>} */}
                    </View>
                </ListItem>
            </TouchableOpacity>
        </Swipeable>
    );

};

const styles = StyleSheet.create({
    title: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 17,
        color: '#000E08'
    },
    subtitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 12,
        color: 'rgba(121, 124, 123, 0.5)'
    },
    recentTime: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 12,
        color: 'rgba(121, 124, 123, 0.5)',
        marginTop: 10
    },
    messageCount: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 12,
        color: 'white'
    },
    messageContainer: {
        width: 22,
        height: 22,
        borderRadius: 11,
        // backgroundColor: colors.primaryColor,
        backgroundColor: colors.transparent,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    }
})

export default ChatUserItem;
