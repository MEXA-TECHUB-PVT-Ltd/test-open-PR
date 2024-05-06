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
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../components/ButtonComponent';
import EmailIcon from '../../assets/svgs/email_icon.svg';
import PasswordIcon from '../../assets/svgs/pass_icon.svg';
import ShowPassIcon from '../../assets/svgs/show_pass_icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import HeaderComponent from '../../components/HeaderComponent';
import fonts from '../../theme/fonts';
import CustomSnackbar from '../../components/CustomToast';
import { BottomSheet } from '@rneui/themed';
import HorizontalDivider from '../../components/DividerLine';
import { registerUser } from '../../redux/authSlices/signUpSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import { sendVerificationCode } from '../../redux/authSlices/sendVerificationCodeSlice';
import { BASE_URL } from '../../configs/apiUrl';
import { storeData } from '../../utilities/localStorage';
import { setSignUpToken } from '../../redux/setTokenSlice';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { setCredentials } from '../../redux/setCredentialsSlice';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const SignUpScreen = ({ navigation, route }) => {
    const { role } = route.params;
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.registerUser)
    const codeVerifyStatus = useSelector((state) => state.sendVerificationCode.status);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [toastType, setToastType] = useState('');
    const [userId, setUserId] = useState('')
    const [sendPofileData, setSendPofileData] = useState({})

    const renderSuccessMessage = (message, result) => {

        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')
        if (role === 'coachee') {
            //setSendPofileData({ ...sendPofileData, role: role })
            const params = {
                email: result?.payload?.result?.email,
                code: result?.payload?.result?.code,
                routeData: { role: role }
            }
            setTimeout(() => {
                resetNavigation(navigation, 'CoacheeVerification', params)
            }, 3000);

        } else {
            setUserId(result?.payload?.result?.id)
            setIsSheetVisible(true);
        }
    }

    const renderErrorMessage = (message) => {

        setMessage('Error')
        setDescription(message)
        setIsVisible(true);
        //setIsSheetVisible(true)
        setToastType('error')
    }
    const handleLoginAPiCall = async (email, password) => {
        const userRegister = { email: email, password: password, role: role };
        const user = { email: email, password: password };
        dispatch(setCredentials(user))

        dispatch(registerUser(userRegister)).then((result) => {
            dispatch(setSignUpToken(result?.payload?.result?.accessToken))
            //console.log('signup result', result?.payload?.result?.accessToken);
            if (result?.payload?.success == true) {
                renderSuccessMessage(result?.payload?.message, result)
            } else {
                renderErrorMessage(result?.payload?.message)
            }

        })

    };

    const verifyCoachEmail = () => {

        const requestOptions = {
            method: "PUT",
            redirect: "follow"
        };

        fetch(`${BASE_URL}/coach/coach-verification/${userId}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
                if (result?.success == true) {
                    setMessage('Success')
                    setDescription('Coach verified successfully')
                    setIsVisible(true);
                    setToastType('success')
                    setIsSheetVisible(false)
                    setTimeout(() => {
                        resetNavigation(navigation, 'SignIn')
                    }, 3000);

                } else {
                    renderErrorMessage(result?.message)
                }
            })
            .catch((error) => {
                console.log(error)
                renderErrorMessage(error)
            });
    }

    const renderToastMessage = () => {
        return <CustomSnackbar visible={isVisible} message={message}
            messageDescription={description}
            onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
    }


    const renderBottomSheet = (email, code) => {
        return <BottomSheet modalProps={{}} isVisible={isSheetVisible}>
            <View
                style={{
                    backgroundColor: 'white',
                    width: "100%",
                    borderTopEndRadius: 16,
                    borderTopStartRadius: 16,
                    padding: 40,
                }}
            >
                <Text style={{ fontSize: 24, fontWeight: '600', color: 'rgba(255, 72, 72, 1)', alignSelf: 'center', marginBottom: 15, marginTop: -15 }}>Alert</Text>
                <HorizontalDivider />
                <Text style={{ fontSize: 18, fontWeight: '500', color: 'rgba(49, 40, 2, 1)', alignSelf: 'center', textAlign: 'center', marginTop: 20 }}>Your sign-up request is being reviewed by the admin</Text>
                <CustomButton
                    loading={codeVerifyStatus == 'loading' ? true : false}
                    onPress={() => {
                        verifyCoachEmail(email, code)
                    }}
                    title={'OK'}
                    customStyle={{ width: '100%', marginBottom: -10 }}
                />
            </View>
        </BottomSheet>
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
                <View style={{ marginStart: 20, marginTop: 20 }}>
                    <HeaderComponent navigation={navigation} navigateTo={'RoleSelector'} />
                </View>
                {renderToastMessage()}
                {renderBottomSheet()}
                <ScrollView style={{ flex: 1 }}>
                    <View>
                        <Formik
                            initialValues={{ email: '', password: '', confirmPassword: '' }}
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
                                        Sign Up to Your Account
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
                                            style={{
                                                marginLeft: 20,
                                                flex: 1,
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

                                    <View style={[styles.inputTextStyle, { marginTop: 20 }]}>
                                        <PasswordIcon
                                            style={{ marginStart: 10 }}
                                            width={24}
                                            height={24}
                                        />
                                        <TextInput
                                            placeholder="Confirm Password"
                                            onChangeText={handleChange('confirmPassword')}
                                            onBlur={handleBlur('confirmPassword')}
                                            value={values.confirmPassword}
                                            secureTextEntry={!showConfirmPassword}
                                            style={{
                                                marginLeft: 20,
                                                flex: 1,
                                            }}
                                        />

                                        {!showConfirmPassword ? <ShowPassIcon
                                            style={{ marginEnd: 10 }}
                                            width={24}
                                            height={24}
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        /> : <Icon onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                            name="eye-off-outline" color={'#969696'} size={20}
                                            style={{ marginEnd: 10 }} />}
                                    </View>
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <Text style={{ color: 'red', marginLeft: 30, marginTop: 10 }}>
                                            {errors.confirmPassword}
                                        </Text>
                                    )}
                                    {/* General Error Message */}
                                    {errors.general && (
                                        <Text style={{ color: 'red' }}>{errors.general}</Text>
                                    )}

                                    <View style={styles.buttonStyle}>
                                        <CustomButton
                                            loading={status == 'loading' ? true : false}
                                            onPress={() => {
                                                handleLoginAPiCall(values.email, values.password);
                                            }}
                                            title={'Sign Up'}
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
                        //marginTop: Platform.OS == 'ios' ? '8%' : '20%',
                        marginBottom: 20
                    }}>
                    <Text
                        style={{
                            fontFamily: fonts.fontsType.medium,
                            fontSize: 16,
                            color: 'rgba(176, 176, 176, 1)',
                        }}>
                        Don’t have an account?
                    </Text>
                    <Text
                        onPress={() => {
                            navigation.removeListener,
                                resetNavigation(navigation, 'SignIn')
                        }}
                        style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.bold,
                            color: 'rgba(15, 109, 106, 1)',
                            marginStart: 5,
                        }}>
                        Sign In
                    </Text>
                </View>
            </SafeAreaView>

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
        width: widthPercentageToDP('70%'),
        fontFamily: fonts.fontsType.bold,
        marginTop: 30,
        color: 'rgba(31, 29, 43, 1)',
        marginStart: 30,
    },
    buttonStyle: { marginTop: 20, alignItems: 'center' },
    forgetPassTextStyle: {
        fontSize: 15,
        color: 'rgba(15, 109, 106, 1)',
        fontWeight: 'bold',
        marginEnd: 25,
    },
    rememberTextStyle: {
        fontSize: 16,
        flex: 1,
        marginStart: -10,
        color: 'rgba(31, 29, 43, 1)',
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

export default SignUpScreen;
