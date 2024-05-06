//import liraries
import React, { useState, useEffect } from "react";
import {
    View,
    Image,
    StyleSheet,
    SafeAreaView,
    Text,
    TextInput,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import ButtonComponent from "../../../components/ButtonComponent";
import ShowPassIcon from '../../../assets/svgs/show_pass_icon'
import PasswordIcon from '../../../assets/svgs/pass_icon.svg'
import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../../../components/HeaderComponent";
import { changePassword } from "../../../redux/authSlices/changePasswordSlice";
import CustomSnackbar from "../../../components/CustomToast";
import { resetNavigation } from "../../../utilities/resetNavigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("Old Password is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const ChangePassword = ({ navigation }) => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.changePassword);

    const handleChangePassword = (old_password, password) => {
        const payload = {
            currentPassword: old_password,
            newPassword: password
        }

        // console.log('payload', payload)

        dispatch(changePassword(payload)).then((result) => {
            console.log(result?.payload)
            if (result?.payload?.success == true) {
                renderSuccessMessage("Password changed successfully")
            } else {
                renderErrorMessage(result?.payload?.message)
            }
        });;
    };

    const renderSuccessMessage = (message) => {
        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')
        setTimeout(() => {
            resetNavigation(navigation, 'Dashboard', { screen: 'Setting' })
        }, 3000);

    }

    const renderErrorMessage = (message) => {
        setMessage('Error')
        setDescription(message)
        setIsVisible(true);
        setToastType('error')
    }


    const renderToastMessage = () => {
        return <CustomSnackbar visible={isVisible} message={message}
            messageDescription={description}
            onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: '5%', marginLeft: 20 }}>
                <HeaderComponent
                    navigation={navigation}
                    navigateTo={'Dashboard'}
                    headerTitle={'Change Password'}
                    params={{ screen: 'Setting' }}
                />
            </View>
            {renderToastMessage()}
            <Formik
                initialValues={{ password: "", confirmPassword: "", old_password: "" }}
                validationSchema={validationSchema}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    isSubmitting,
                    handleBlur,
                }) => (

                    <>
                        <View style={{ flex: 1 }}>

                            <View style={[styles.inputTextStyle, { marginTop: 40 }]}>
                                <PasswordIcon style={{ marginStart: 10 }} width={24} height={24} />
                                <TextInput
                                    placeholder="Old Password"
                                    onChangeText={handleChange("old_password")}
                                    onBlur={handleBlur("old_password")}
                                    value={values.old_password}
                                    secureTextEntry={!showOldPassword}
                                    style={{
                                        marginLeft: 20,
                                        flex: 1,
                                    }}
                                />

                                <ShowPassIcon
                                    style={{ marginEnd: 10 }}
                                    width={24}
                                    height={24}
                                    onPress={() => setShowOldPassword(!showOldPassword)}
                                />
                            </View>
                            {touched.old_password && errors.old_password && (
                                <Text style={{ color: "red", marginLeft: 30, marginTop: 5 }}>
                                    {errors.old_password}
                                </Text>
                            )}

                            <View style={[styles.inputTextStyle, { marginTop: 20 }]}>
                                <PasswordIcon style={{ marginStart: 10 }} width={24} height={24} />
                                <TextInput
                                    placeholder="Password"
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
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
                                <Text style={{ color: "red", marginLeft: 30, marginTop: 5 }}>
                                    {errors.password}
                                </Text>
                            )}

                            <View style={[styles.inputTextStyle, { marginTop: 20 }]}>
                                <PasswordIcon style={{ marginStart: 10 }} width={24} height={24} />
                                <TextInput
                                    placeholder="Confirm Password"
                                    onChangeText={handleChange("confirmPassword")}
                                    onBlur={handleBlur("confirmPassword")}
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
                                <Text style={{ color: "red", marginLeft: 30, marginTop: 5 }}>
                                    {errors.confirmPassword}
                                </Text>
                            )}

                        </View>

                        <View style={styles.buttonStyle}>
                            <ButtonComponent
                                title={"Change"}
                                loading={status == 'loading' ? true : false}
                                customStyle={{ width: "85%" }}
                                onPress={() => {
                                    handleChangePassword(values.old_password, values.password)
                                }}
                            />
                        </View>
                    </>

                )}
            </Formik>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    imageStyle: {
        width: 263,
        height: 171,
        alignSelf: "center",
        marginTop: 60,
    },
    buttonStyle: {
        marginTop: 30,
        alignItems: "center",
    },

    inputTextStyle: {
        width: '85%',
        height: 52,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#F6F6F6",
        alignSelf: "center",
        marginTop: 50,
    },
    welcomeTextStyle: {
        fontSize: 28,
        alignSelf: "center",
        marginTop: 30,
    },
});

//make this component available to the app
export default ChangePassword;
