import React, { Component, useEffect } from 'react';
import {
    Text, FlatList, StyleSheet, ImageBackground, View, TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import colors from '../../theme/colors';
import TransactionListItem from '../../components/TransactionListItem';
import fonts from '../../theme/fonts';
import { useDispatch, useSelector } from 'react-redux';
import FullScreenLoader from '../../components/CustomLoader';
import { resetNavigation } from '../../utilities/resetNavigation';
import BackArrow from '../../assets/svgs/back_arrow_white.svg';
import BadgeStar from '../../assets/svgs/badge_star_icon.svg'
import { fetchCoacheeWellcoins } from '../../redux/CoacheeSlices/getWellcoinsSlice';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import WellcoinsListItem from '../../components/WellcoinsListItem';

const WellcoinsDetails = ({ navigation }) => {
    const dispatch = useDispatch();
    const { response, status } = useSelector((state) => state.coacheeWellcoins)

    useEffect(() => {
        dispatch(fetchCoacheeWellcoins({limit:''}))
    }, [dispatch])

    return (
        <ScrollView style={styles.container}>

            <ImageBackground
                source={require('../../assets/images/my_wallet_bg.png')} // Replace 'backgroundImage.jpg' with your image path
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <TouchableOpacity
                    onPress={() => {
                        resetNavigation(navigation, 'Dashboard')
                    }}
                    style={styles.backButtonContainer}
                >
                    <BackArrow style={styles.backButton} />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <View style={styles.badgeContainer}>
                        <BadgeStar  />
                        <Text style={styles.badgeTextStyle}>{'45'}</Text>
                        {/* {
                            status === 'loading' ? <ActivityIndicator
                                style={{ marginStart: 5 }}
                                size={'small'}
                                color={'white'} /> :


                                <Text style={styles.badgeTextStyle}>{'45'}</Text>
                        } */}

                    </View>
                    <Text style={styles.balanceText}>Total Wellcoins</Text>
                </View>
            </ImageBackground>

            <View style={{ margin: 20, flex: 1 }}>
                <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: 17,
                    color: '#212121',
                }}>Wellcoins History</Text>
                {
                    status == 'loading' ? <FullScreenLoader visible={status} /> :
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ marginBottom: 20 }}
                            data={response?.result}
                            renderItem={({ item }) => (
                                <WellcoinsListItem
                                    coach_name={`${item?.coach_details?.first_name} ${item?.coach_details?.last_name}`}
                                    category={item?.coaching_area_details?.name}
                                    imgUrl={item?.coach_details?.profile_pic}
                                    date={item.date}
                                    totalCoins={item?.total_coins}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString() + item}
                        />
                }

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    badgeContainer: {
        // width: 65,
        // height: 30,
        //borderRadius: 50,
        //backgroundColor: colors.primaryColor,
        flexDirection: 'row',
        //marginTop:35
    },
    badgeTextStyle: {
        fontFamily: fonts.fontsType.medium,
        color: colors.white,
        fontSize: 28,
        lineHeight: 27,
        marginStart: 5,
    },
    backgroundImage: {
        width: '100%',
        height: 210,
    },
    backButtonContainer: {
        position: 'absolute',
        top: heightPercentageToDP('6%'),
        left: 20,
    },
    backButton: {
        width: 20,
        height: 20,
        color: '#FFFFFF',
    },
    headerContent: {
        marginTop: heightPercentageToDP('13%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
  
    balanceText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 15,
        color: '#FFFFFF',
    },

});

export default WellcoinsDetails;
