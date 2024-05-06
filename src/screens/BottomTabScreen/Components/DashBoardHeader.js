import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import BellIcon from '../../../assets/svgs/bell_icon.svg'
import BadgeStar from '../../../assets/svgs/badge_star_icon.svg'
import { useSelector, useDispatch } from 'react-redux';
import { getData } from '../../../utilities/localStorage';
import { fetchCoacheeWellcoins } from '../../../redux/CoacheeSlices/getWellcoinsSlice';
import { resetNavigation } from '../../../utilities/resetNavigation';

const DashBoardHeader = ({ navigation }) => {
    const dispatch = useDispatch();
    const { role } = useSelector((state) => state.userLogin)
    const { response, status } = useSelector((state) => state.coacheeWellcoins)
    const { user_name } = useSelector((state) => state.userLogin)
    const [fullName, setFullName] = useState(null);
    useEffect(() => {
        const getUserData = async () => {
            const userData = await getData('userData');
            setFullName(`${userData?.user?.first_name} ${userData?.user?.last_name}`)
        }
        getUserData();
    }, [fullName])

    useEffect(() => {
        dispatch(fetchCoacheeWellcoins({ limit: 0 }));
    }, [dispatch])

    return (
        <View style={styles.container}>
            <Text style={styles.userNameStyle}>{`${user_name || fullName},`}
            </Text>
            <BellIcon style={{ alignSelf: 'center', marginRight: 10 }} />
            {role === 'coachee' && <TouchableOpacity
                onPress={() => {
                    resetNavigation(navigation, 'WellcoinsDetails')
                }}
                style={styles.badgeContainer}>
                <BadgeStar style={{ marginStart: 5 }} />
                {
                    status === 'loading' ? <ActivityIndicator
                        style={{ marginStart: 5 }}
                        size={'small'}
                        color={'white'} /> :


                        <Text style={styles.badgeTextStyle}>{response?.overallTotalCoins || '0'}</Text>
                }

            </TouchableOpacity>}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        //marginHorizontal:10,
        marginTop: 10,
    },
    userNameStyle: {
        fontFamily: fonts.fontsType.semiBold,
        color: '#312802',
        fontSize: 23,
        lineHeight: 47,
        flex: 1
    },
    badgeContainer: {
        width: 65,
        height: 30,
        borderRadius: 50,
        backgroundColor: colors.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    badgeTextStyle: {
        fontFamily: fonts.fontsType.medium,
        color: colors.white,
        fontSize: 13,
        lineHeight: 27,
        marginStart: 3,
        marginEnd: 5,
        alignSelf: 'center'
    }
});

//make this component available to the app
export default DashBoardHeader;
