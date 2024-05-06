import React, { useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Image,
    ScrollView, FlatList, ActivityIndicator
} from 'react-native';
import colors from '../../../theme/colors';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import fonts from '../../../theme/fonts';
import { Badge } from '@rneui/themed';
import RateStarIcon from '../../../assets/svgs/rate_star_icon.svg'
import ArrowForward from '../../../assets/svgs/see_all_forward_arrow.svg'
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoaches } from '../../../redux/DashboardSlices/getAllCoachesSlice';
import { resetNavigation } from '../../../utilities/resetNavigation';
import { setCategoryId } from '../../../redux/DashboardSlices/setCategoryIdSlice';

const CoachListComponent = ({ navigation }) => {
    const dispatch = useDispatch();
    const coaches = useSelector((state) => state.getAllCoaches.coaches);
    const status = useSelector((state) => state.getAllCoaches.status);
    const error = useSelector((state) => state.getAllCoaches.error);
    const currentPage = useSelector((state) => state.getAllCoaches.currentPage);
    const hasMore = useSelector((state) => state.getAllCoaches.hasMore);

    //console.log('coaches--->', JSON.stringify(coaches))
    // console.log('currentPage--->', currentPage)
    // console.log('error--->', error)
    // console.log('status--->', status)
    // console.log('hasMore--->', hasMore)



    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCoaches({ pageSize: 3, page: currentPage }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const loadMore = () => {
        // if (hasMore && currentPage > 1) {
        //     dispatch(fetchCoaches({ pageSize: 3, page: currentPage + 1 }));
        // }

        if (status === 'succeeded') {
            dispatch(fetchCoaches({ pageSize: 3, page: currentPage + 1 }));
        }


    }

    const handleSetCategoryId = (categoryId, screenName) => {
        dispatch(setCategoryId(categoryId))
        resetNavigation(navigation, screenName)
    }


    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => { handleSetCategoryId(item?.user_id, "CoachDetail") }}
            style={styles.container}>
            <Image
                style={styles.image}
                source={{ uri: item?.profile_pic || 'https://via.placeholder.com/150?text=' }}
            />
            {/* <View style={styles.overlay}>
                <Text style={styles.overlayText}>Available Today</Text>
            </View> */}
            <View style={{
                flexDirection: 'row',
                // marginStart: 5
            }}>

                <Text style={styles.coachNameStyle}>
                    {/* {`${item?.first_name} ${item?.last_name}`} */}
                    {`${item?.first_name}`}
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
            {/* <ScrollView
                // nestedScroll={true} 
                horizontal
                style={{ 
                    // marginTop: 5, marginStart: 5 
                }} >
                {item?.coaching_area_names.map((area, index) => (
                    <Text key={index} style={styles.categoryTextStyle}>
                        {area}
                        {index !== item?.coaching_area_names.length - 1 ? ', ' : ''}
                    </Text>
                ))}
            </ScrollView> */}
            <ScrollView
                // nestedScroll={true} 
                horizontal
                style={{
                    // marginTop: 5, marginStart: 5 
                }}
            >
                {item?.coaching_area_names.slice(0, 2).map((area, index) => (
                    <React.Fragment key={index}>
                        <Text style={styles.categoryTextStyle}>
                            {area}
                            {index !== 1 && ','}
                        </Text>
                    </React.Fragment>
                ))}
                {/* {item?.coaching_area_names.length > 1 && (
                    <Text style={styles.plusSign}>{`+${item?.coaching_area_names.length-1}`}</Text>
                )} */}
            </ScrollView>
        </TouchableOpacity>
    );

    const renderSection = ({ item }) => (
        <View>
            <View style={{ flexDirection: 'row' }}>

                <Image
                    style={styles.areaIconStyle}
                    source={{ uri: item?.area_icon && item?.area_icon }} />
                <Text style={styles.areaNameStyle}>{item?.area_name}</Text>

                <Text
                    onPress={() => {
                        handleSetCategoryId(item?.area_id, 'CoachesCategory')
                    }}
                    style={styles.seeAllTextStyle}>See All</Text>

                <ArrowForward width={18} height={18} style={{
                    alignSelf: 'center'
                }} />


            </View>
            <FlatList
                data={item.coaches}
                renderItem={renderItem}
                keyExtractor={(coach) => coach.id.toString()}
                horizontal={true} // Make the FlatList horizontal
            />
        </View>
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
        <View style={{ marginBottom: 30 }}>
            <FlatList
                data={coaches}
                renderItem={renderSection}
                keyExtractor={(area) => area?.area_id?.toString()}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={renderFooter}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        // backgroundColor: colors.white,
        // shadowOpacity: 0.05,
        width: 170,
        height: 176,
        position: 'relative',
        marginTop: 10,
        //marginEnd: 10,
        marginEnd: -15,
        borderRadius: 12,

    },
    image: {
        // height: 126,
        // width: 170,
        height: 100,
        width: 140,

        borderRadius: 12,
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

        color: 'rgba(0, 0, 0, 0.6)'
    },
    seeAllTextStyle: {
        fontFamily: fonts.fontsType.map,
        fontSize: 15,

        color: '#312802',
        marginStart: 10,
        alignSelf: 'center'
    },
    areaNameStyle: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 16,
        color: colors.primaryColor,
        marginStart: 10,
        alignSelf: 'center',
        flex: 1
    },
    areaIconStyle: {
        width: 20,
        height: 20,
        alignSelf: 'center',
        //tintColor:colors.primaryColor
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
        fontSize: 13,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.black,
        alignSelf: 'center',

    },
    plusSign: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 13,
        color: colors.primaryColor,
        bottom: 3,
        right: 5
    },
});

//make this component available to the app
export default CoachListComponent;
