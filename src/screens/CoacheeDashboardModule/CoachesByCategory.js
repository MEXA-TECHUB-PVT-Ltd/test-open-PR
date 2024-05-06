import React, { useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    Image, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Badge } from '@rneui/themed';
import RateStarIcon from '../../assets/svgs/rate_star_icon.svg'
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderComponent from '../../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachByArea } from '../../redux/DashboardSlices/getCoachByCategorySlice';
import { setCategoryId } from '../../redux/DashboardSlices/setCategoryIdSlice';
import { resetNavigation } from '../../utilities/resetNavigation';

const CoachesByCategory = ({ navigation }) => {
    const dispatch = useDispatch();
    const { categoryId } = useSelector(state => state.categoryId);
    const { status, currentPage, coaches, error } = useSelector(state => state.getCoachByArea);
    // console.log(categoryId)
    // console.log('currentPage',currentPage)
    // console.log('status',status)
    //console.log('coaches',coaches)
    // console.log('error',error)


    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCoachByArea({ pageSize: 10, page: currentPage, areaId: categoryId }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const loadMore = () => {
        // if (hasMore && currentPage > 1) {
        //     dispatch(fetchCoaches({ pageSize: 3, page: currentPage + 1 }));
        // }

        if (status === 'succeeded') {
            dispatch(fetchCoachByArea({ pageSize: 10, page: currentPage, areaId: categoryId }));
        }


    }

    const handleSetCategoryId = (user_id, screenName) => {
        dispatch(setCategoryId(user_id))
        resetNavigation(navigation, screenName)
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                handleSetCategoryId(item?.user_id, "CoachDetail")
            }}
            style={styles.container}>
            <Image
                style={styles.image}
                source={{ uri: item?.profile_pic && item?.profile_pic }}
            />
            {/* <View style={styles.overlay}>
                <Text style={styles.overlayText}>Available Today</Text>
            </View> */}
            <View style={{
                flexDirection: 'row',
                marginStart: 5,
                marginTop: 10
            }}>

                <Text style={styles.coachNameStyle}>
                    {`${item?.first_name} ${item?.last_name}`}
                </Text>
                <Badge
                    badgeStyle={{ backgroundColor: 'black' }}
                    containerStyle={{
                        alignSelf: 'center',
                        marginStart: 5,
                    }} />

                <RateStarIcon
                    width={16}
                    height={16}
                    style={{ alignSelf: 'center', marginStart: 5 }} />

                <Text style={styles.rateStyle}>
                    {`${Math.round(item?.avg_rating)}`}
                </Text>
            </View>
            <ScrollView
                horizontal
                style={{ marginTop: 5, }} >
                {item?.coaching_areas.map((area, index) => (
                    <Text key={index} style={styles.categoryTextStyle}>
                        {area}
                        {index !== item?.coaching_areas.length - 1 ? ', ' : ''}
                    </Text>
                ))}
            </ScrollView>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (status === 'loading' && currentPage === 1) {
            return null
        }
        if (status === 'loading') {
            return <ActivityIndicator size="large" color={colors.primaryColor} />; // Spinner at end of list
        }
        if (status === 'failed') {
            return <Text>Error: {error}</Text>;
        }
        return null;
    };

    return (
        <SafeAreaView style={styles.flatListContainer}>
            <HeaderComponent
                headerTitle={'Fitness Coaches'}
                navigation={navigation}
                navigateTo={'Dashboard'}
                customContainerStyle={{marginTop:0}}
                />
            <View style={{ flex: 1, }}>
                <FlatList
                    data={coaches}
                    renderItem={renderItem}
                    keyExtractor={(index, item) => item + index}
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 20, marginBottom: 20 }}
                    ListFooterComponent={renderFooter}
                    onEndReached={loadMore}
                    onEndReachedThreshold={1}
                />
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    flatListContainer: {
        margin: 20,
        flex: 1
    },
    container: {
        // backgroundColor: colors.white,
        // shadowOpacity: 0.05,
        width: wp('90%'),
        height: 268,
        position: 'relative',
        marginTop: 10,
        marginEnd: 10,

    },
    image: {
        height: 208,
        width: wp('90%'),
        borderRadius: 12,
        alignSelf:'center'
    },
    overlay: {
        position: 'absolute',
        top: hp('10%'),
        left: 8,
        borderRadius: 16,
        backgroundColor: '#1CBA22',
        height: 25,
        width: hp('13%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#029008',
        borderWidth: 1
    },
    overlayText: {
        color: 'white',
        fontFamily: fonts.fontsType.bold,
        fontSize: 11,
        lineHeight: 13
    },
    categoryTextStyle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 13,
        lineHeight: 19,
        color: 'rgba(0, 0, 0, 0.8)',
        textAlign: 'left',
        marginStart: 5
    },

    rateStyle: {
        fontSize: 13,
        lineHeight: 19,
        fontFamily: fonts.fontsType.regular,
        color: 'rgba(0, 0, 0, 0.6)',
        alignSelf: 'center',
        marginStart: 5
    },
    coachNameStyle: {
        fontSize: 14,
        lineHeight: 21,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.black,
        alignSelf: 'center',

    }
});

export default CoachesByCategory;
