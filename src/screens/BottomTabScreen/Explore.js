//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput } from 'react-native';
import colors from '../../theme/colors';
import CoachListComponent from './Components/CoachListComponent';
import DashBoardHeader from './Components/DashBoardHeader';
import fonts from '../../theme/fonts';
import SearchIcon from '../../assets/svgs/search_gray.svg'
import CrossIcon from '../../assets/svgs/cross_icon.svg'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import CoachHomeSessionList from './Components/CoachHomeSessionList';

const Explore = ({ navigation }) => {
    const { role } = useSelector((state) => state.userLogin)
    const [searchText, setSearchText] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.dashboardImageStyle}
                source={require('../../assets/images/dashboard_log_img.png')} />
            <View style={{ margin: 20, marginBottom: hp('43%') }}>

                <DashBoardHeader navigation={navigation} />
                <Text style={styles.greetingMessageStyle}>Nice to see you 👋🏻</Text>
                <View style={[styles.inputContainerStyle, {
                    backgroundColor: isFocused ? colors.transparent : 'rgba(238, 238, 238, 1)',
                    height: 45,
                    borderWidth: isFocused ? 1 : 0,
                    borderColor: isFocused ? colors.primaryColor : 'rgba(238, 238, 238, 1)',
                }]}>
                    <SearchIcon style={{ marginStart: 10 }} />
                    <TextInput
                        placeholder="Search coaches"
                        value={searchText}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChangeText={(text) => setSearchText(text)}
                        placeholderTextColor={'rgba(118, 118, 118, 1)'}
                        style={styles.inputStyle}
                    />
                    {searchText.length > 0 && <CrossIcon onPress={() => { setSearchText('') }} style={{ marginEnd: 5 }} />}
                </View>

                {role === 'coachee' ?
                    <CoachListComponent navigation={navigation} />
                    :
                    <CoachHomeSessionList searchQuery={searchText} navigation={navigation} />
                }

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
    dashboardImageStyle: {
        width: 154,
        height: 42,
        alignSelf: 'center',
        marginTop: 10
    },
    greetingMessageStyle: {
        fontFamily: fonts.fontsType.regular,
        color: '#676767',
        fontSize: 17,
        lineHeight: 27,
        marginBottom: 10,
        marginTop: -5
    },
    inputStyle: {
        flex: 1,
        marginStart: 10,
        fontFamily: fonts.fontsType.medium,
        fontSize: 15,
        width: wp('100%'),

    },
    inputContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 12,
        width: wp('88%')
    }

});

//make this component available to the app
export default Explore;
