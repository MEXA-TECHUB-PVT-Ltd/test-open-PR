import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import fonts from '../../../theme/fonts';
import { Rating } from 'react-native-ratings';

const ReviewListItem = ({ profilePic, name, rating, comment }) => {

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Image source={{ uri: profilePic }} style={styles.profilePic} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Rating
                        type='star'
                        readonly={true}
                        startingValue={rating}
                        imageSize={20}
                        minValue={0}
                        ratingCount={5}
                        style={{alignSelf:'flex-start'}}
                    />

                </View>

            </View>

            <Text style={styles.comment}>{comment}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    mainContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        borderColor: 'rgba(0, 0, 0, 0.14)'

    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    detailsContainer: {
       alignItems:'center'
    },
    name: {
        fontSize: 18,
        fontFamily: fonts.fontsType.semiBold,
        marginBottom: 5,
        marginTop: 10,
        color: '#312802'
    },
    comment: {
        fontSize: 14,
        marginTop: 15,
        color: '#222222',
        fontFamily: fonts.fontsType.regular
    },
});

export default ReviewListItem;
