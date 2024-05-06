// CustomBottomTabBar.js

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import fonts from '../theme/fonts';
import colors from '../theme/colors';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const CustomBottomTabBar = ({ state, descriptors, navigation, icons }) => {
    const { routes } = state;
    //const currentRouteName = navigation.dangerouslyGetState().routes[state.index].name;

    return (
        <View style={styles.tabContainer}>
            {routes.map((route, index) => {
                console.log(index)
                console.log(route.name)
                const { options } = descriptors[route.key];
                const label = options.title !== undefined ? options.title : route.name;
                const Icon = options.icon; // Extract icon from options
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[styles.tabButton, isFocused && styles.selectedTab]}
                    >
                        {/* Icon */}
                        <Image style={{
                            height: 24,
                            width: 26,
                            alignSelf: 'center',
                            tintColor: isFocused
                                ? colors.primaryColor
                                : colors.inActiveIconColor,
                        }}
                            source={icons[index]} />

                        {/* Text */}
                        {isFocused && <Text style={styles.tabText}>{label}</Text>}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.white, // adjust as needed
         height: Platform.OS === 'ios' ? 80 : 56, // Adjust height for iOS and Android
        // height: Platform.OS === 'ios' ? 50 : 56, // change this because of in App.js i have used SafeAreaView otherwise use 80
        paddingBottom: Platform.OS === 'ios' ? 15 : 0, // Adjust padding for iOS
        shadowOpacity: 0.05,
        elevation: 4,
        // flexDirection: 'row',
        // justifyContent: 'space-around',
        // alignItems: 'center',
        // backgroundColor: colors.white, // adjust as needed
        // height: widthPercentageToDP('15%'),
        // // marginBottom: 20,
        // shadowOpacity: 0.05,
        // elevation: 4,
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingHorizontal: 10,
        marginTop:Platform.OS === 'ios' ? 15 : 0,
        height: 40
    },
    selectedTab: {
        backgroundColor: colors.tabBarItemBg,
    },
    tabText: {

        marginStart: 10,
        alignSelf: 'center',
        color: colors.primaryColor,
        fontFamily: fonts.fontsType.medium,
        fontSize: 15,
        lineHeight: 29
    },
});

export default CustomBottomTabBar;
