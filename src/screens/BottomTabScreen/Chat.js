import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View, TextInput, ActivityIndicator } from 'react-native';
import ChatUserItem from './Components/ChatUserListComponent';
import colors from '../../theme/colors';
import HeaderComponent from '../../components/HeaderComponent';
import { Text } from 'react-native-elements';
import fonts from '../../theme/fonts';
import { Icon } from 'react-native-elements';
import SearchIcon from '../../assets/svgs/list_search.svg'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/ButtonComponent';
import { BottomSheet } from '@rneui/themed';
import HorizontalDivider from '../../components/DividerLine';
import { reportUser } from '../../redux/reportChatUserSlice';

const SERVER_URL = 'https://mainstays-be.mtechub.com';
//const SERVER_URL = 'http://localhost:5019';
const Chat = ({ navigation }) => {
    const dispatch = useDispatch()
    const [contacts, setContacts] = useState([]);
    const [socket, setSocket] = useState(null);
    const { user_id } = useSelector(state => state.userLogin)
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [showReportSheet, setShowReportSheet] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);

    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);
        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        // Return a cleanup function to disconnect socket when component unmounts
        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (socket) {

            const userId = parseInt(user_id);
            socket.emit("fetch contacts", { userId });

            socket.on('contacts', (contactList) => {
                const filteredContacts = contactList.filter(contact =>
                    contact?.contact_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact?.contact_last_name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setContacts(filteredContacts)
                setLoading(false)
            });
        }

        return () => {
            if (socket) {
                socket.off("contacts");
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, searchQuery]);


    if (loading) {
        return <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={colors.primaryColor} size={'large'} />
        </View>
    }


    const renderDeleteBottomSheet = () => {
        return <BottomSheet modalProps={{}} isVisible={isSheetVisible}>
            <View
                style={{
                    backgroundColor: 'white',
                    width: "100%",
                    borderTopEndRadius: 40,
                    borderTopStartRadius: 40,
                    padding: 40,
                }}
            >
                <Text style={{
                    fontSize: 20,
                    fontFamily: fonts.fontsType.semiBold,
                    color: 'rgba(255, 72, 72, 1)',
                    alignSelf: 'center',
                    marginBottom: 15,
                    marginTop: -15
                }}>Delete Chat</Text>
                <HorizontalDivider />
                <Text style={{
                    fontSize: 16,
                    fontFamily: fonts.fontsType.medium,
                    color: 'rgba(49, 40, 2, 1)',
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 20
                }}>
                    Are you sure you want to delete chat?
                </Text>
                <CustomButton
                    onPress={() => {
                        handleDelete()
                    }}
                    title={'Yes, Delete'}
                    customStyle={{ width: '100%', marginBottom: -10 }}
                />
                <CustomButton
                    onPress={() => {
                        setIsSheetVisible(false)
                    }}
                    title={'Cancel'}
                    customStyle={{
                        width: '100%',
                        marginBottom: -10,
                        backgroundColor: colors.transparent
                    }}
                    textCustomStyle={{ color: colors.primaryColor }}
                />
            </View>
        </BottomSheet>
    }

    const renderReportBottomSheet = () => {
        return <BottomSheet modalProps={{}} isVisible={showReportSheet}>
            <View
                style={{
                    backgroundColor: 'white',
                    width: "100%",
                    borderTopEndRadius: 40,
                    borderTopStartRadius: 40,
                    padding: 40,
                }}
            >
                <Text style={{
                    fontSize: 20,
                    fontFamily: fonts.fontsType.semiBold,
                    color: 'rgba(255, 72, 72, 1)',
                    alignSelf: 'center',
                    marginBottom: 15,
                    marginTop: -15
                }}>Report User</Text>
                <HorizontalDivider />
                <Text style={{
                    fontSize: 16,
                    fontFamily: fonts.fontsType.medium,
                    color: 'rgba(49, 40, 2, 1)',
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 20
                }}>
                    Are you sure you want to report chat?
                </Text>
                <CustomButton
                    onPress={() => {
                        handleReport()
                    }}
                    title={'Yes, Report'}
                    customStyle={{ width: '100%', marginBottom: -10 }}
                />
                <CustomButton
                    onPress={() => {
                        setShowReportSheet(false)
                    }}
                    title={'Cancel'}
                    customStyle={{
                        width: '100%',
                        marginBottom: -10,
                        backgroundColor: colors.transparent
                    }}
                    textCustomStyle={{ color: colors.primaryColor }}
                />
            </View>
        </BottomSheet>
    }

    const handleDelete = () => {
        const currentUserId = parseInt(user_id);
        const selectedUserId = parseInt(selectedContactId);
        if (socket) {
            //console.log('Sending delete request...');
            socket.emit("delete messages", {
                senderid: currentUserId,
                receiverid: selectedUserId,
            });

            // Listen for acknowledgment from the server
            socket.on('messages deleted', (deletedMessage) => {
                // Fetch updated contacts after deletion
                socket.emit("fetch contacts", { userId: deletedMessage?.senderid });
            });

        } else {
            console.log('Socket connection not available.');
        }
        setIsSheetVisible(false);
    };


    const handleReport = () => {
        //console.log('selectedContactId', selectedContactId)
        // const currentUserId = parseInt(user_id);
        // const selectedUserId = parseInt(selectedContactId);
        // dispatch(reportUser({
        //     sender_id: currentUserId,
        //     receiver_id: selectedUserId,
        // })).then((result) => {
        //     console.log('result', result?.payload);
        // })

        setShowReportSheet(false);
    };


    const renderItem = ({ item }) => (
        <ChatUserItem
            user={item}
            onDeletePress={() => {
                setSelectedContactId(item?.contact_id);
                setIsSheetVisible(true);
            }}
            onReportPress={() => {
                setSelectedContactId(item?.contact_id);
                setShowReportSheet(true);
            }}
            navigation={navigation}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 20 }}>
                <Text style={styles.headerStyle}>Chat</Text>

                <View style={styles.textInputContainer}>
                    <SearchIcon />
                    <TextInput
                        style={styles.textInputStyle}
                        placeholder='Search here..'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor='rgba(137, 137, 137, 0.83)'
                    />
                </View>

            </View>
            <FlatList
                data={contacts}
                renderItem={renderItem}
                keyExtractor={(item, index) => item + index}
                style={{ marginTop: 20 }}
            />
            {renderDeleteBottomSheet()}
            {renderReportBottomSheet()}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 253, 253, 1)',
        borderRadius: 28,
        paddingHorizontal: 10,
        width: wp('90%'),
        alignSelf: 'center',
        height: 45,
        marginTop: 30,
        borderWidth: 0.5,
        borderColor: 'rgba(229, 229, 229, 1)'
    },
    headerStyle: {
        color: 'rgba(49, 40, 2, 1)',
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 23,
        alignSelf: 'center'
    },
    textInputStyle: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 8,
        color: colors.black
    }
})

export default Chat;
