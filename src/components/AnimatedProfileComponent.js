import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import ProgressCircle from 'react-native-progress-circle'
import fonts from '../theme/fonts';
import CircularProgress from 'react-native-circular-progress-indicator';
import { resetNavigation } from '../utilities/resetNavigation';
import { storeData } from '../utilities/localStorage';
import { resetState, signInUser } from '../redux/authSlices/userLoginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getData } from '../utilities/localStorage';

const AnimatedProfile = ({ percentage, role, navigation }) => {
  const { signUpToken } = useSelector((state) => state.setToken)
  const { credentials } = useSelector((state) => state.credentials)
  const [fill, setFill] = useState(0);
  const dispatch = useDispatch();

  async function delayAndStoreData(result) {
    const { payload } = result;
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await storeData("token", payload?.result?.accessToken);
    await storeData('userData', payload?.result);

  }

  useEffect(() => {

    const handleSignInUserCall = async () => {
      const user = { email: credentials?.email, password: credentials?.password };
      dispatch(signInUser(user)).then((result) => {
        if (result?.payload?.success == true) {
          delayAndStoreData(result)
          console.log('animated screen:User Signed In Successfully')
        } else {
          console.log('animated screen error:', result?.payload?.message)
        }

      });
    };


    const checkToken = async () => {

      try {
        const storedToken = await getData('token');
        const userData = await getData('userData');
        // console.log('userDatatest', userData)
        // console.log('signUpToken', signUpToken)
        // console.log('storedToken signUpToken', signUpToken)
        // console.log('storedToken', storedToken)
        await storeData('token', signUpToken);

        if (signUpToken) {
          dispatch(resetState({
            token: signUpToken,
            role: userData?.data?.role,
            user_name: `${userData?.data?.first_name} ${userData?.data?.last_name}`,
            user_id: userData?.data?.user_id
          }))
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }

      // if (role === 'coach') {
      //   resetNavigation(navigation, "SignIn");
      // } else {
      //   try {
      //     const storedToken = await getData('token');
      //     const userData = await getData('userData');
      //     console.log('userDatatest', userData)
      //     console.log('signUpToken', signUpToken)

      //     if (signUpToken) {
      //       dispatch(resetState({
      //         token: signUpToken,
      //         role: userData?.data?.role,
      //         user_name: `${userData?.data?.first_name} ${userData?.data?.last_name}`,
      //         user_id: userData?.data?.user_id
      //       }))
      //     }
      //   } catch (error) {
      //     console.error('Error checking token:', error);
      //   }
      // }

    };



    if (fill === 100) {
      setTimeout(() => {
        handleSignInUserCall();
        //checkToken();
      }, 3000);
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fill]);


  return (
    <View style={styles.container}>

      <AnimatedCircularProgress
        size={150}
        width={8}
        fill={fill}
        prefill={0}
        duration={2000}
        tintColor="white"
        // delay={50}
        onAnimationComplete={() => { setFill(100) }}
        backgroundColor="rgba(170, 170, 170, 1)" >

        {(fill) => (
          <Text style={{
            fontSize: 34,
            fontFamily: fonts.fontsType.semiBold,
            color: 'white'
          }}>{`${Math.round(fill)}%`}</Text>
        )}



      </AnimatedCircularProgress>

      {/* <ProgressCircle
        percent={100}
        radius={85}
        borderWidth={4}
        color="rgba(170, 170, 170, 1)"
        shadowColor="rgba(170, 170, 170, 1)"
        bgColor="rgba(15, 109, 106, 1)"
        containerStyle={{ width: 155, height: 155 }}
      >
        <Text style={{ fontSize: 34, fontFamily: fonts.fontsType.semiBold, color: 'rgba(171, 171, 171, 1)' }}>{`${percentage}%`}</Text>
      </ProgressCircle> */}
      <Text style={{
        fontSize: 25,
        fontFamily: fonts.fontsType.bold,
        fontWeight: fonts.fontWeight.bold,
        color: 'rgba(255, 255, 255, 1)',
        width: 353,
        textAlign: 'center',
        marginTop: 20
      }}>Generating Best Coaches for You</Text>

      <Text style={{
        fontSize: 15,
        fontFamily: fonts.fontsType.medium,
        color: 'rgba(255, 255, 255, 1)',
        width: 353,
        textAlign: 'center',
        marginTop: 20
      }}>Our mission is to match you with exceptional coaches who will inspire, guide, and empower you on your path to success</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimatedProfile;
