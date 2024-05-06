import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import colors from '../../theme/colors';
import SessionListItem from '../BottomTabScreen/Components/SessionListItem';
import HeaderComponent from '../../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSessionList } from '../../redux/Sessions/getSessionListSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import FullScreenLoader from '../../components/CustomLoader';


const MyCoachingList = ({ navigation }) => {
    const dispatch = useDispatch();
    const { status, sessionList, error } = useSelector((state) => state.sessionList)
    const { role } = useSelector((state) => state.userLogin)
    // console.log('sessionList', sessionList)
    // console.log('error', error)
    console.log('status', status)

    useEffect(() => {
        dispatch(fetchSessionList({ role: role }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const handleNavigation = (item) => {
        const params = {
            sessionItem: item
        }
        resetNavigation(navigation, 'SessionReviewBooking', params)
    }

    const renderSessions = ({ item }) => (
        <SessionListItem sessionDetail={item} onPress={() => {
            handleNavigation(item)
        }} />
    );

    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent
                navigation={navigation}
                navigateTo={'Dashboard'}
                headerTitle={'Requested Session'}
                customContainerStyle={{ marginStart: 20, marginTop: 10 }}
            />
            <View style={{ margin: 30, flex: 1, marginTop: 10 }}>

                <FlatList
                    data={sessionList?.sessions}
                    renderItem={renderSessions}
                    keyExtractor={(item, index) => index.toString() + item}
                    showsVerticalScrollIndicator={false}
                />

            </View>

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
export default MyCoachingList;
