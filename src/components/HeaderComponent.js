import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BackArrow from "../assets/svgs/backArrow.svg";
import fonts from "../theme/fonts";
import { resetNavigation } from "../utilities/resetNavigation";

const HeaderComponent = ({
  navigation,
  headerTitle,
  navigateTo,
  customContainerStyle,
  customTextStyle,
  params = {},
  icon
}) => {
  return (
    <View style={[styles.itemConatiner, customContainerStyle]}>
      {!icon && <TouchableOpacity onPress={() => {
        navigation && resetNavigation(navigation, navigateTo, params && params);
      }} style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center',}}>
        <BackArrow
          height={32}
          width={32}
          // onPress={() => {
          //   //navigation && navigation.navigate(navigateTo);
          //   navigation && resetNavigation(navigation, navigateTo, params && params);
          // }}
          style={{ alignSelf: "center", }}
        />
      </TouchableOpacity>}
      <Text style={[styles.headerTitleStyle, customTextStyle]}>{headerTitle}</Text>
      {icon && icon}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  headerTitleStyle: {
    alignSelf: "center",
    marginStart: 40,
    color: "rgba(49, 40, 2, 1)",
    fontSize: 20,
    flex: 1,
    fontFamily: fonts.fontsType.semiBold

  },
  itemConatiner: {
    flexDirection: "row",
    marginTop: 10,
  },
});

//make this component available to the app
export default HeaderComponent;
