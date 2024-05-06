import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../theme/colors';
import fonts from '../theme/fonts';

const EmptyDataView = ({message}) => {
    return (
        <View style={styles.container}>
            <Image
                style={{
                    width: 150,
                    height: 150,
                    marginVertical: 20
                }}
                source={{ uri: 'https://img.freepik.com/premium-vector/flat-vector-no-data-search-error-landing-concept-illustration_939213-230.jpg?w=1060' }} />

            {/* <Text style={{
                color: colors.primaryColor,
                fontFamily: fonts.fontsType.semiBold,
                fontSize: 18,

            }}>{message}</Text> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        marginBottom:70
    },
});

export default EmptyDataView;

