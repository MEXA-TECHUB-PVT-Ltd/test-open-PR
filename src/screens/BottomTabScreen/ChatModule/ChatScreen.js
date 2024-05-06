import React, { useState, useEffect, useRef } from 'react';
import {
    View, Platform, KeyboardAvoidingView, TouchableOpacity,
    Dimensions, TextInput, StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import fonts from '../../../theme/fonts';
import SendIcon from '../../../assets/svgs/send_btn.svg'
const { width: screenWidth } = Dimensions.get('window');
import ChatHeader from '../../../components/ChatHeader';
import colors from '../../../theme/colors';
import HorizontalDivider from '../../../components/DividerLine';
import { resetNavigation } from '../../../utilities/resetNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachDetail } from '../../../redux/DashboardSlices/getSingleCoachDetailSlice';

 const SERVER_URL = 'https://mainstays-be.mtechub.com';
//const SERVER_URL = 'http://localhost:5019';

export default function ChatScreen({ navigation }) {
    const dispatch = useDispatch()
    const { coachDetails, status, error } = useSelector((state) => state.getCoachDetail)
    const receiverId = useSelector(state => state.setReceiverId.receiverId.receiverId)
    const role = useSelector(state => state.setReceiverId.receiverId.role)
    const { user_id } = useSelector(state => state.userLogin)
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const giftedChatRef = useRef(null);
    //console.log('coachDetails', coachDetails)
    //console.log('testid', receiverId)
    //console.log('testrole', role)
    //console.log('user_id', user_id)

    //sender Id should be logedIn user id... (Current User)
    //receiver Id should be one you want to chat..

    useEffect(() => {
        dispatch(fetchCoachDetail({ coachId: receiverId, chatRole: role }))
    }, [dispatch, receiverId, role])

    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);
        // Log a message when socket is connected
        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        // Return a cleanup function to disconnect socket when component unmounts
        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMessage = (newMessage) => {
        setMessages([]);
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
    };

    useEffect(() => {
        if (socket) {
            //socket.on('messages', handleMessage);

            // socket.emit("fetch messages", {
            //     senderid: 15,
            //     receiverid: 115,
            // });

            socket.emit("fetch messages", {
                senderid: user_id,
                receiverid: receiverId,
            });

            socket.on('messages', (newMessage) => {
                //console.log('msg list-->', newMessage)
                const reConstructedMessages = newMessage.map(message => {
                    return {
                        _id: Math.round(Math.random() * 1000000),
                        text: message.message,
                        createdAt: new Date(message.timestamp),
                        user: {
                            _id: message.senderid
                        }
                    };
                }).reverse();
                handleMessage(reConstructedMessages)
                setLoading(false);
            });
        }

        return () => {
            if (socket) {
                socket.off("messages");
                // socket.off("fetch messages");
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        const chatMessageListener = (newMessage) => {
            console.log('new message', newMessage)
            const transformedMessage = {
                _id: Math.round(Math.random() * 1000000),
                text: newMessage.message,
                createdAt: new Date(),
                user: {
                    _id: parseInt(newMessage.senderid),
                }
            };
            setMessages((previousMessages) => GiftedChat.append(previousMessages, transformedMessage));
        };

        if (socket) {
            socket.on("chat message", chatMessageListener);
        }

        return () => {
            if (socket) {
                socket.off("chat message", chatMessageListener);
            }
        };
    }, [socket]);



    const onSend = (newMessages = []) => {
        // Emit the new message to the server
        //socket.emit('chat message', newMessages[0]);
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
        setInputText(''); // Clear input text after sending message
    };

    const handleSend = () => {
        if (inputText.trim().length > 0) {
            const newMessage = {
                senderid: user_id,
                receiverid: receiverId,
                // receiverid: 115,
                message: inputText.trim(),
                //createdAt: new Date(),
            }
            socket.emit('chat message', newMessage);
            // const newMessage2 = {
            //     _id: Math.round(Math.random() * 1000000), // Generate unique ID for the message
            //     text: inputText.trim(),
            //     createdAt: new Date(),
            //     user: {
            //         _id: parseInt(user_id),
            //     },
            // };
            // onSend(newMessage2);
            setInputText(''); // Clear input text after sending message
        }
    };

    const renderInputToolbar = () => {
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Send Message"
                    multiline
                />
            </View>
        );
    };

    const renderBubble = (props) => {

        const messageUserId = props.currentMessage.user._id;
        const isCurrentUser = parseInt(messageUserId) === parseInt(user_id);

        //console.log('isCurrentUser', isCurrentUser)

        return (
            <Bubble
                {...props}
                isCurrentUser={isCurrentUser}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#DCEBEB',
                        ...styles.bubbleContainer,
                        borderBottomRightRadius: 0
                    },
                    left: {
                        backgroundColor: 'rgba(228, 228, 228, 0.83)',
                        ...styles.bubbleContainer,
                        borderBottomLeftRadius: 0,

                    },
                }}

                textStyle={{
                    right: {
                        color: 'rgba(15, 109, 106, 1)',
                        fontFamily: fonts.fontsType.regular,
                        fontSize: 15
                    },
                    left: {
                        color: 'rgba(56, 55, 55, 1)',
                        fontFamily: fonts.fontsType.regular,
                        fontSize: 15
                    },
                }}

                timeTextStyle={{
                    right: {
                        color: 'gray', // Change the color of time for messages sent by the current user
                    },
                    left: {
                        color: 'gray', // Change the color of time for messages sent by other users
                    },
                }}
            />
        );
    };

    const scrollToBottom = () => {
        giftedChatRef.current.scrollToBottom();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={{ marginHorizontal: 10 }}>

                <ChatHeader
                    name={`${coachDetails?.first_name} ${coachDetails?.last_name}`}
                    profilePic={(coachDetails?.details?.profile_pic || coachDetails?.profile_pic) || "https://via.placeholder.com/150?text="}
                    online={true}
                    onPress={() => {
                        resetNavigation(navigation, "Dashboard", { screen: 'Chat' })
                    }}
                />

            </View>
            <HorizontalDivider height={1} customStyle={{ marginTop: 20 }} />
            {loading ? ( // Show loader if messages are still loading
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.primaryColor} />
                </View>
            ) : (<GiftedChat
                //ref={giftedChatRef}
                messages={messages}
                onSend={(newMessages) => onSend(newMessages)}
                user={{
                    _id: parseInt(user_id),
                }}
                alignTop={false}
                inverted={true}
                renderAvatar={null}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
            />)}
            {/* Floating button
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 20,
                    alignSelf: 'center',
                    backgroundColor: 'blue',
                    borderRadius: 30,
                    padding: 10,
                }}
                onPress={() => { scrollToBottom() }}>
                <Icon name="arrow-down" size={30} color="white" />
            </TouchableOpacity> */}

            {Platform.OS === 'android' && <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} />}
            <TouchableOpacity style={styles.sendButton} onPress={() => { handleSend() }}>
                {Platform.OS === 'android' ? <SendIcon width={45} height={45} /> :
                    <SendIcon />}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    bubbleContainer: {
        borderRadius: 28,
        marginBottom: 30,
        marginRight: 8,
        marginLeft: 8,
    },
    sendButton: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 22 : 10,
        right: 10,
        marginEnd: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',

    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
    inputContainer: {

        borderRadius: 28,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 10 : 0,
        marginStart: 20,
        backgroundColor: '#E4E4E4',
        bottom: Platform.OS === 'ios' ? -10 : 10,
        width: wp('75%'),
        position: 'absolute',

    },
    textInput: {
        fontSize: 14,
        fontFamily: fonts.fontsType.regular,
        color: 'rgba(0, 0, 0, 0.6)',
        textAlignVertical: 'center',

    },
    loaderContainer: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});





