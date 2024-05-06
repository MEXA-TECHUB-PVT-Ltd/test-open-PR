// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Image,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../components/ButtonComponent';
import EmailIcon from '../../assets/svgs/email_icon.svg';
import PasswordIcon from '../../assets/svgs/pass_icon.svg';
import ShowPassIcon from '../../assets/svgs/show_pass_icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import AndroidCheckBox from '@react-native-community/checkbox';
import { CheckBox } from '@rneui/themed';
import HeaderComponent from '../../components/HeaderComponent';
import fonts from '../../theme/fonts';
import CustomSnackbar from '../../components/CustomToast';
import { resetState, signInUser } from '../../redux/authSlices/userLoginSlice';
import { removeData, storeData } from '../../utilities/localStorage';
import { resetNavigation } from '../../utilities/resetNavigation';
import { setSignUpToken } from '../../redux/setTokenSlice';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { setCredentials } from '../../redux/setCredentialsSlice';
import { setAnyData } from '../../redux/setAnyTypeDataSlice';
// Validation schema using Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});


const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.userLogin)
  console.log('status', status);
  console.log('error', error);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [checked, setCheckBoxChecked] = React.useState(false);
  const toggleCheckbox = () => setCheckBoxChecked(!checked);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [toastType, setToastType] = useState('');


  async function delayAndStoreData(result) {
    const { payload } = result;
    const { user } = payload.result;

    if (user.role === 'coach') {
      console.log('condition 1')
      const { is_completed, is_stripe_completed } = user?.coach;
      console.log('hhhh', user?.coach.is_completed)
      if (!user?.coach.is_completed) {
        await removeData("accessToken");
        await storeData("accessToken", payload?.result?.accessToken);
        resetNavigation(navigation, 'CoachProfile');
      }
      if (is_completed && is_stripe_completed) {
        console.log('condition 3')
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await storeData("token", payload?.result?.accessToken);
        await storeData('userData', payload?.result);
      } else if (is_completed && !is_stripe_completed) {
        console.log('condition 4')
        await storeData('userData', payload?.result);
        navigation.navigate('CreateStripeAccount');
      }
    }
    else {
      console.log('condition 2')
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await storeData("token", payload?.result?.accessToken);
      await storeData('userData', payload?.result);
    }

    // Additional conditions specific to coach role

  }

  const renderSuccessMessage = async (message, result) => {
    setMessage('Success')
    setDescription(message)
    setIsVisible(true);
    setToastType('success')
    delayAndStoreData(result);
  }

  const renderErrorMessage = (message) => {
    setMessage('Error')
    setDescription(message)
    setIsVisible(true);
    setToastType('error')
  }

  const handleSignInUserCall = async (email, password) => {
    // console.log(email, password);
    const user = { email: email, password: password };
    dispatch(setCredentials(user))
    dispatch(setAnyData({})); // to clear data for new coach profile.
    dispatch(signInUser(user)).then((result) => {
      //console.log('result', result?.payload?.result?.accessToken);
      dispatch(setSignUpToken(result?.payload?.result?.accessToken))
      if (result?.payload?.success == true) {
        renderSuccessMessage('User Signed In Successfully', result)
      } else {
        renderErrorMessage(result?.payload?.message)
      }

    });
  };

  const renderToastMessage = () => {
    return <CustomSnackbar visible={isVisible} message={message}
      messageDescription={description}
      onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ marginStart: 20, marginTop: 20 }}>
              <HeaderComponent />
            </View>
            {renderToastMessage()}
            <View>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}>
                {({
                  values,
                  handleChange,
                  handleSubmit,
                  errors,
                  touched,
                  isSubmitting,
                  handleBlur,
                }) => (
                  <View style={styles.loginContainer}>
                    <Image
                      style={{ width: 160, height: 90, alignSelf: 'center' }}
                      source={require('../../assets/images/sign_logo.png')}
                    />
                    <Text style={styles.welcomeTextStyle}>
                      Sign In to Your Account
                    </Text>
                    <View style={styles.inputTextStyle}>
                      <EmailIcon style={{ marginStart: 10 }} width={24} height={24} />
                      <TextInput
                        placeholder="Email Address"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={'rgba(118, 118, 118, 1)'}
                        style={{
                          marginLeft: 20,
                          flex: 1
                        }}
                      />
                    </View>

                    {touched.email && errors.email && (
                      <Text style={{ color: 'red', marginLeft: 30, marginTop: 10 }}>
                        {errors.email}
                      </Text>
                    )}

                    {/* Password Input with Eye Icon/Button */}
                    <View style={[styles.inputTextStyle, { marginTop: 20 }]}>
                      <PasswordIcon
                        style={{ marginStart: 10 }}
                        width={24}
                        height={24}
                      />
                      <TextInput
                        placeholder="Password"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry={!showPassword}
                        placeholderTextColor={'rgba(118, 118, 118, 1)'}
                        style={{
                          marginLeft: 20,
                          flex: 1,

                        }}
                      />

                      {!showPassword ? <ShowPassIcon
                        style={{ marginEnd: 10 }}
                        width={24}
                        height={24}
                        onPress={() => setShowPassword(!showPassword)}
                      /> : <Icon onPress={() => setShowPassword(!showPassword)}
                        name="eye-off-outline" color={'#969696'} size={20}
                        style={{ marginEnd: 10 }} />}
                    </View>
                    {touched.password && errors.password && (
                      <Text style={{ color: 'red', marginLeft: 30, marginTop: 10 }}>
                        {errors.password}
                      </Text>
                    )}
                    {/* General Error Message */}
                    {errors.general && (
                      <Text style={{ color: 'red' }}>{errors.general}</Text>
                    )}

                    <View style={styles.textContainer}>
                      {Platform.OS == 'android' ? (
                        <AndroidCheckBox
                          value={isChecked}
                          onValueChange={() => setChecked(!isChecked)}
                          style={{ marginLeft: 20, marginEnd: 10, marginTop: '-1%' }}
                        />
                      ) : (
                        <CheckBox
                          checked={checked}
                          onPress={toggleCheckbox}
                          iconType="material-community"
                          checkedIcon="checkbox-marked"
                          uncheckedIcon="checkbox-blank"
                          checkedColor={'rgba(15, 109, 106, 1)'}
                          uncheckedColor="rgba(235, 235, 235, 1)"
                          containerStyle={{ marginTop: '-3%', marginLeft: 20 }}
                        />
                      )}

                      <Text style={styles.rememberTextStyle}> Remember me</Text>
                      <Text
                        style={styles.forgetPassTextStyle}
                        onPress={() => {
                          navigation.navigate('ForgetPassword');
                        }}>
                        Forget Password?
                      </Text>
                    </View>

                    <View style={styles.buttonStyle}>
                      <CustomButton
                        loading={status === 'loading' ? true : false}
                        onPress={() => {
                          handleSignInUserCall(values.email, values.password);
                        }}
                        title={'Sign In'}
                        customStyle={{ width: '85%' }}
                      />
                    </View>

                  </View>
                )}
              </Formik>
            </View>

          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              // marginTop: Platform.OS == 'ios' ? '20%' : '30%',
              marginBottom: 20
            }}>
            <Text
              style={{
                fontSize: fonts.fontSize.font16,
                color: 'rgba(176, 176, 176, 1)',
                fontFamily: fonts.fontsType.regular
              }}>
              Don’t have an account?
            </Text>
            <Text
              onPress={() => {
                navigation.navigate('RoleSelector');
              }}
              style={{
                fontSize: fonts.fontSize.font16,
                fontFamily: fonts.fontsType.semiBold,

                color: 'rgba(15, 109, 106, 1)',
                marginStart: 5,
              }}>
              Sign Up
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 215,
    height: 65,
    alignSelf: 'center',
    marginTop: 40,
  },
  loginContainer: {
    backgroundColor: 'white',
    marginTop: 30,
  },
  welcomeTextStyle: {
    fontSize: 28,
    width: widthPercentageToDP('60%'),
    fontFamily: fonts.fontsType.bold,
    marginTop: 30,
    color: 'rgba(31, 29, 43, 1)',
    marginStart: 30,

  },
  buttonStyle: { marginTop: 20, alignItems: 'center' },
  forgetPassTextStyle: {
    fontSize: 13,
    color: 'rgba(15, 109, 106, 1)',
    fontFamily: fonts.fontsType.semiBold,
    marginEnd: 25,
  },
  rememberTextStyle: {
    fontSize: 13,
    flex: 1,
    marginStart: -10,
    fontFamily: fonts.fontsType.medium,
    color: 'rgba(49, 40, 2, 1)',
  },
  inputTextStyle: {
    width: '85%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    alignSelf: 'center',
    marginTop: 30,
    padding: 0,
  },
  textContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  backgroundImage: {
    resizeMode: 'contain',
    width: '100%',
  },
});

export default SignInScreen;
