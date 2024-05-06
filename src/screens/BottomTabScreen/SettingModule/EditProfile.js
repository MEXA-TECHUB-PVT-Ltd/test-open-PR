import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    FlatList,
    Platform,
    ScrollView,
    PermissionsAndroid
} from "react-native";
import CustomInput from "../../../components/TextInputComponent";
import CustomButton from "../../../components/ButtonComponent";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import fonts from "../../../theme/fonts";
import HeaderComponent from "../../../components/HeaderComponent";
import EditButton from "../../../assets/svgs/profile_edit_icon.svg";
import ArrowDown from "../../../assets/svgs/arrow_down.svg";
import { BottomSheet } from "@rneui/themed";
import CustomCheckbox from "../../../components/CustomCheckbox";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../../redux/CoacheeSlices/CountrySlice";
import SearchIcon from "../../../assets/svgs/search_gray.svg";
import CancleIcon from "../../../assets/svgs/cross_icon.svg";
import HorizontalDivider from "../../../components/DividerLine";
import CameraIcon from "../../../assets/svgs/camera_icon.svg";
import GalleryIcon from "../../../assets/svgs/gallery_icon.svg";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { postCoacheeProfile } from "../../../redux/CoacheeSlices/submitCoacheeProfileSlice";
import { getData } from "../../../utilities/localStorage";
import CustomSnackbar from "../../../components/CustomToast";
import { resetNavigation } from "../../../utilities/resetNavigation";
import { fetchUserProfile } from "../../../redux/authSlices/getUserProfileSlice";
import FullScreenLoader from "../../../components/CustomLoader";
import moment from "moment";
import { requestCameraPermission } from "../../../utilities/cameraPermission";

const EditProfile = ({ navigation }) => {
    const dispatch = useDispatch();
    const [countrySheetVisible, setCountrySheetVisible] = useState(false);
    const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const countries = useSelector(state => state.countries.countries);
    const { status } = useSelector(state => state.coacheeProfile);
    const { user_id } = useSelector(state => state.userLogin);
    const error = useSelector(state => state.countries.error);
    const profileStatus = useSelector(state => state.getUserProfile.status);
    const [searchText, setSearchText] = useState("");
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');

    const [inputValues, setInputValues] = useState({
        firstname: '',
        lastname: '',
        date_of_birth: '',
        phone: '',
        country_id: '',
        profile_pic: '',
        email: '',
        role: ''
    });

    const handleEditAvatar = () => {
        // ... (Same as before)
    };

    const handleInputChange = (text, identifier) => {
        setInputValues(prevInputValues => ({
            ...prevInputValues,
            [identifier]: text,
        }));
    };

    const handleCheckboxClick = languageId => {
        const isSelected = selectedCountries.includes(languageId);
        if (isSelected) {
            setSelectedCountries(prevSelected =>
                prevSelected.filter(id => id !== languageId),
            );
        } else {
            setSelectedCountries(prevSelected => [...prevSelected, languageId]);
            handleInputChange(languageId, 'country_id')
            setCountrySheetVisible(false)
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    useEffect(() => {
        dispatch(fetchCountries());
    }, [dispatch]);


    useEffect(() => {
        const getUserData = async () => {
            const userData = await getData('userData');
            dispatch(fetchUserProfile({
                user_id: userData?.user?.id ? userData?.user?.id : user_id,
                role: userData?.user?.role
            })).then((result) => {
                setInputValues(prevInputValues => ({
                    ...prevInputValues,
                    firstname: result?.payload?.user?.first_name,
                    lastname: result?.payload?.user?.last_name,
                    phone: result?.payload?.user?.details?.phone || result?.payload?.user?.phone,
                    date_of_birth: moment(result?.payload?.user?.details?.date_of_birth || result?.payload?.user?.date_of_birth).format('YYYY-MM-DD'),
                    profile_pic: result?.payload?.user?.details?.profile_pic || result?.payload?.user?.profile_pic,
                    country_id: result?.payload?.user?.details?.country_id || result?.payload?.user?.country_id,
                    email: result?.payload?.user?.email,
                    role: result?.payload?.user?.role
                }));
            });

        }

        getUserData();
    }, [dispatch, user_id])

    const openImagePicker = () => {
        setPhotoSheetVisible(false)
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                handleInputChange(imageUri, 'profile_pic')
            }
        });
    };

    const handleCameraLaunch = () => {

        requestCameraPermission();

        setPhotoSheetVisible(false)

        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                handleInputChange(imageUri, 'profile_pic')
                //console.log(imageUri);
            }
        });
    }

    //console.log('selectedImage',selectedImage)

    const handleSubmitProfile = () => {

        const newPayload = {
            profile_pic: inputValues?.profile_pic,
            first_name: inputValues?.firstname,
            last_name: inputValues?.lastname,
            phone: inputValues?.phone,
            country_id: inputValues?.country_id,
            date_of_birth: inputValues?.date_of_birth,
            role: inputValues?.role
        }

        //console.log('newPayload', newPayload);

        const imageType = newPayload?.profile_pic?.endsWith('.png') ? 'image/png' : 'image/jpeg';

        const formData = new FormData();
        formData.append('profile_pic', {
            uri: newPayload?.profile_pic,
            type: imageType,
            name: `image_${Date.now()}.${imageType.split('/')[1]}`,
        });
        formData.append('first_name', newPayload?.first_name);
        formData.append('last_name', newPayload?.last_name);
        formData.append('phone', newPayload?.phone);
        formData.append('country_id', newPayload?.country_id);
        formData.append('date_of_birth', newPayload?.date_of_birth);
        formData.append('role', newPayload?.role);

        //console.log('formData', JSON.stringify(formData));

        dispatch(postCoacheeProfile(formData)).then((result) => {
            console.log(result?.payload)
            if (result?.payload?.success === true) {
                renderSuccessMessage("Profile edited successfully")
            }
            else {
                renderErrorMessage(result?.payload?.message)
            }
        })

    }


    const renderSuccessMessage = (message) => {

        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')
        setTimeout(() => {
            resetNavigation(navigation, "Dashboard", { screen: 'Setting' });
        }, 3000);

    }

    const renderErrorMessage = (message) => {

        setMessage('Error')
        setDescription(message)
        setIsVisible(true);
        setToastType('error')
    }

    const getCountryNameById = (countryId) => {
        const country = countries?.country?.find(country => country.id === countryId);
        return country ? country.name : null;
    };

    const renderLanguageItem = ({ item }) => (
        <View style={{ margin: 8 }}>
            <View
                style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
                <Text
                    style={{
                        flex: 1,
                        fontFamily: fonts.fontsType.medium,
                        fontSize: 17,
                        color: "rgba(115, 115, 115, 1)",
                        lineHeight: 29,
                    }}>
                    {item.name}
                </Text>
                <CustomCheckbox
                    checkedColor="rgba(15, 109, 106, 1)"
                    uncheckedColor="rgba(238, 238, 238, 1)"
                    onToggle={() => {
                        handleCheckboxClick(item.id);
                    }}
                />
            </View>
            <HorizontalDivider height={1} customStyle={{ marginTop: 5 }} />
        </View>
    );

    const rendercountrySheet = () => {
        return (
            <BottomSheet modalProps={{}} isVisible={countrySheetVisible}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: '100%',
                        height: hp('70%'),
                        borderTopEndRadius: 16,
                        borderTopStartRadius: 16,
                        padding: 20,
                    }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text
                            style={{
                                fontSize: 22,
                                color: "rgba(49, 40, 2, 1)",
                                fontFamily: fonts.fontsType.semiBold,
                            }}>
                            Select Country
                        </Text>
                        <CancleIcon
                            onPress={() => {
                                setCountrySheetVisible(false);
                            }}
                        />
                    </View>

                    {/* renderList here */}

                    <View style={{ padding: 10, marginTop: hp("2%"), flex: 2 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 20,
                                borderRadius: 12,
                                backgroundColor: isFocused
                                    ? "transparent"
                                    : "rgba(238, 238, 238, 1)",
                                height: 45,
                                borderWidth: isFocused ? 1 : 0,
                                borderColor: isFocused
                                    ? "rgba(15, 109, 106, 1)"
                                    : "rgba(238, 238, 238, 1)",
                            }}>
                            <SearchIcon style={{ marginStart: 10 }} />
                            <TextInput
                                placeholder="Search country here"
                                value={searchText}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChangeText={text => setSearchText(text)}
                                placeholderTextColor={"rgba(118, 118, 118, 1)"}
                                style={{
                                    marginStart: 10,
                                    fontFamily: fonts.fontsType.medium,
                                    fontSize: 15,
                                    width: wp("100%"),
                                }}
                            />
                        </View>

                        <FlatList
                            data={countries?.country?.filter(country =>
                                country.name.toLowerCase().includes(searchText.toLowerCase()),
                            )}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderLanguageItem}
                            keyExtractor={item => item.id.toString()}
                        />
                    </View>
                </View>
            </BottomSheet>
        );
    };

    const renderPhotoBottomSheet = () => {
        return (
            <BottomSheet modalProps={{}} isVisible={photoSheetVisible}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: '100%',
                        height: hp('45%'),
                        borderTopEndRadius: 16,
                        borderTopStartRadius: 16,
                        padding: 10,
                    }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text
                            style={{
                                fontSize: 22,
                                color: "rgba(49, 40, 2, 1)",
                                fontFamily: fonts.fontsType.semiBold,
                            }}>
                            Select an Option
                        </Text>
                        <CancleIcon
                            onPress={() => {
                                setPhotoSheetVisible(false);
                            }}
                        />
                    </View>

                    {/* renderList here */}

                    <View style={{ alignItems: "center", marginTop: 30 }}>
                        <TouchableOpacity
                            style={{
                                width: 360,
                                height: 128,
                                borderRadius: 15,
                                backgroundColor: "rgba(229, 239, 239, 1)",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => { handleCameraLaunch() }}>
                            <CameraIcon />
                            <Text
                                style={{
                                    color: "rgba(15, 109, 106, 1)",
                                    fontSize: 19,
                                    fontFamily: fonts.fontsType.semiBold,
                                    marginTop: 10,
                                }}>
                                Camera
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: 360,
                                height: 128,
                                borderRadius: 15,
                                backgroundColor: "rgba(229, 239, 239, 1)",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 20,
                            }}
                            onPress={() => { openImagePicker() }}>
                            <GalleryIcon />
                            <Text
                                style={{
                                    color: "rgba(15, 109, 106, 1)",
                                    fontSize: 19,
                                    fontFamily: fonts.fontsType.semiBold,
                                    marginTop: 10,
                                }}>
                                Gallery
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        );
    };

    const renderToastMessage = () => {
        return <CustomSnackbar visible={isVisible} message={message}
            messageDescription={description}
            onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
    }

    if (profileStatus === 'loading') {
        return <FullScreenLoader visible={profileStatus} />
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            enabled>
            <HeaderComponent
                navigation={navigation}
                navigateTo={'Dashboard'}
                headerTitle={'Edit Profile'}
                params={{ screen: 'Setting' }}
                customContainerStyle={{
                    //marginTop: hp("5%"),
                    marginStart: wp("-3%")
                }}
                customTextStyle={{ marginStart: 70 }}
            />
            {renderToastMessage()}

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ alignItems: "center", }}>
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={handleEditAvatar}>
                            <Image

                                source={
                                    inputValues?.profile_pic
                                        ? { uri: inputValues?.profile_pic }
                                        : require("../../../assets/images/user_profile_dummy.png")
                                }
                                style={styles.avatar}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {
                                setPhotoSheetVisible(true);
                            }}>
                            <EditButton />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputRow}>
                    <View style={{ flex: 1, }}>

                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            color: '#312802',
                            fontSize: 16,
                        }}>
                            First Name
                        </Text>

                        <CustomInput
                            value={inputValues?.firstname}
                            identifier="firstname"
                            placeholder="First Name"
                            onValueChange={handleInputChange}
                            customContainerStyle={{ marginRight: 10 }}
                        />

                    </View>

                    <View style={{ flex: 1, }}>

                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            color: '#312802',
                            fontSize: 16,
                        }}>
                            Last Name
                        </Text>

                        <CustomInput
                            value={inputValues?.lastname}
                            identifier="lastname"
                            placeholder="Last Name"
                            onValueChange={handleInputChange}
                            customContainerStyle={{}}
                        />

                    </View>


                </View>

                <View style={{ marginTop: 20 }}>

                    <Text style={{
                        fontFamily: fonts.fontsType.semiBold,
                        color: '#312802',
                        fontSize: 16,
                    }}>
                        Date of Birth
                    </Text>

                    <CustomInput
                        value={inputValues?.date_of_birth}
                        identifier="date_of_birth"
                        placeholder="Date of Birth"
                        onValueChange={handleInputChange}
                    />

                </View>


                <View style={{ marginTop: 20 }}>

                    <Text style={{
                        fontFamily: fonts.fontsType.semiBold,
                        color: '#312802',
                        fontSize: 16,
                    }}>
                        Phone Number
                    </Text>

                    <CustomInput
                        value={inputValues?.phone}
                        identifier="phone"
                        placeholder="Phone Number"
                        onValueChange={handleInputChange}
                    />

                </View>


                <View style={{ marginTop: 20 }}>

                    <Text style={{
                        fontFamily: fonts.fontsType.semiBold,
                        color: '#312802',
                        fontSize: 16,
                    }}>
                        Email Address
                    </Text>

                    <CustomInput
                        value={inputValues?.email}
                        identifier="email"
                        placeholder="Email Address"
                        onValueChange={handleInputChange}
                        isEditable={false}
                    />

                </View>


                <View style={{ marginTop: 20 }}>

                    <Text style={{
                        fontFamily: fonts.fontsType.semiBold,
                        color: '#312802',
                        fontSize: 16,
                    }}>
                        Select Country
                    </Text>

                    <CustomInput
                        value={getCountryNameById(inputValues?.country_id)}
                        identifier="country"
                        placeholder="Country name here"
                        onValueChange={handleInputChange}
                        isEditable={false}
                        onPress={() => {
                            setCountrySheetVisible(true);
                        }}
                        iconComponent={
                            <ArrowDown
                                style={{ marginRight: 20 }}
                                onPress={() => {
                                    setCountrySheetVisible(true);
                                }}
                            />
                        }
                    />

                </View>

                <CustomButton
                    loading={status === 'loading' ? true : false}
                    title={"Edit Profile"}
                    customStyle={{ marginTop: hp("5%"), width: wp("85%"), }}
                    onPress={() => {
                        handleSubmitProfile()
                    }}
                />

            </ScrollView>

            {rendercountrySheet()}
            {renderPhotoBottomSheet()}

        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        padding: 20,
        backgroundColor: "white",
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
        position: "relative",
        marginTop: hp("4%"),
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#F6F6F6'
    },
    editButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        borderRadius: 20,
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    headerTextStyle: {
        fontFamily: fonts.fontsType.bold,
        fontSize: 27,
        fontWeight: fonts.fontWeight.bold,
        color: "rgba(49, 40, 2, 1)",
    },
    descriptionStyle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 16,
        color: "rgba(125, 125, 125, 1)",
        width: wp("100%"),
        textAlign: "center",
        marginTop: hp("2%"),
        lineHeight: 24,
    },
});

export default EditProfile;
