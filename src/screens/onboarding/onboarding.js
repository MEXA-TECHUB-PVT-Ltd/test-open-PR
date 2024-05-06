import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import fonts from '../../theme/fonts';
import CustomButton from '../../components/ButtonComponent';
import { storeData } from '../../utilities/localStorage';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

const onboardingData = [
  {
    title: 'Find the right Coach for what you need',
    image: require('../../assets/images/onboarding-1.png'), // Replace with your image path
  },
  {
    title: 'Book suitable sessions and get great results',
    image: require('../../assets/images/onboarding-2.png'), // Replace with your image path
  },
  {
    title: 'Let’s do a Session and live healthy with us',
    image: require('../../assets/images/onboarding-3.png'), // Replace with your image path
  },
];

const Onboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      swiperRef.current.scrollBy(1, true);
    }
    if (currentIndex == 2) {
      navigation.navigate('SignIn')
      await storeData('firstLaunch', true)

    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      swiperRef.current.scrollBy(-1, true);
    }
  };

  const handleIndexChanged = index => {
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{ flex: 1, marginBottom: -20 }}>
        <Swiper
          ref={swiperRef}
          loop={false}
          showsButtons={false}
          showsPagination={false}
          onIndexChanged={handleIndexChanged}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}>
          {onboardingData.map((item, index) => (
            <View key={index} style={styles.slide}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
            </View>
          ))}
        </Swiper>

        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                index === currentIndex
                  ? styles.indicator
                  : styles.inActiveindicator,
                {
                  backgroundColor:
                    index === currentIndex
                      ? 'rgba(15, 109, 106, 1)'
                      : 'lightgray',
                },
              ]}
            />
          ))}
        </View>
        <View style={{
          // marginBottom:30
        }}>
          <CustomButton
            title={currentIndex == 2 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            customStyle={{ width: widthPercentageToDP('80%'), }}
          />
          {currentIndex > 0 ? (
            <Text
              style={{
                fontFamily: fonts.fontsType.semiBold,
                fontSize: fonts.fontSize.font16,
                alignSelf: 'center',
                color: 'rgba(15, 109, 106, 1)',
                marginBottom: 20,
                marginTop:-20
              }}
              onPress={handleBack}>
              Go Back
            </Text>
          ) : <Text style={{color:'white',fontSize: fonts.fontSize.font16,}}>Go Back</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: heightPercentageToDP('70%'),
    resizeMode: 'cover',
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.fontsType.bold,
    marginVertical: 20,
    textAlign: 'center',
    marginHorizontal: 60,
    color: 'black'
  },
  button: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    marginVertical: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 30,
    height: 9,
    borderRadius: 5,
    margin: 5,
  },
  inActiveindicator: {
    width: 9,
    height: 9,
    borderRadius: 5,
    margin: 5,
  },
  dot: {
    backgroundColor: 'rgba(196, 196, 196, 1)',
    width: 9,
    height: 9,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: 'rgba(15, 109, 106, 1)',
    width: 30,
    height: 9,
    borderRadius: 4,
    margin: 3,
  },
});

export default Onboarding;

