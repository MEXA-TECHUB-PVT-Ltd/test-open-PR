import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import fonts from '../theme/fonts';
import colors from '../theme/colors';
import HorizontalDivider from './DividerLine';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';

const WellcoinsListItem = ({ coach_name, totalCoins, date, imgUrl, category }) => {
    return (
        <View>
            <View style={styles.transactionItem}>
                <Image style={{ width: 45, height: 50, borderRadius: 8 }} source={{ uri: imgUrl }} />
                <View style={{ marginHorizontal: 8 }}>
                    <Text style={styles.amount}>{coach_name}</Text>
                    <View style={{ flexDirection: 'row',  flex:1 }}>
                        <Text style={styles.date}>{`${category} - ${moment(date).format('DD MMM,YYYY')}`}</Text>
                        <Text style={[styles.coins]}>{`${totalCoins} Wellcoins`}</Text>
                    </View>
                </View>

            </View>
            <HorizontalDivider
                height={1}
                customStyle={{ width: wp('90%'), alignSelf: 'center' }} />
        </View>
    );
};

const styles = StyleSheet.create({
    transactionItem: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        // paddingHorizontal: 16,
        paddingVertical: 15,
        marginTop: 10
    },
    amount: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 17,
        color: colors.primaryColor,
    },
    date: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 13,
        color: '#000000',
        opacity: 0.6,
        alignSelf:'center'
    },
    coins: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 12,
        color: '#000000',
        opacity: 0.6,
        alignSelf:'center',
        marginHorizontal:8
    },
});

export default WellcoinsListItem;
