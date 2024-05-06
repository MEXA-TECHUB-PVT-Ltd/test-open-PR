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
    SafeAreaView
} from "react-native";
import CustomInput from "../../components/TextInputComponent";
import CustomButton from "../../components/ButtonComponent";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import fonts from "../../theme/fonts";
import HeaderComponent from "../../components/HeaderComponent";
import EditButton from "../../assets/svgs/profile_edit_icon.svg";
import ArrowDown from "../../assets/svgs/arrow_down.svg";
import { BottomSheet } from "@rneui/themed";
import FullScreenLoader from "../../components/CustomLoader";
import CustomCheckbox from "../../components/CustomCheckbox";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../redux/CoacheeSlices/CountrySlice";
import SearchIcon from "../../assets/svgs/search_gray.svg";
import CancleIcon from "../../assets/svgs/cross_icon.svg";
import HorizontalDivider from "../../components/DividerLine";
import CameraIcon from "../../assets/svgs/camera_icon.svg";
import GalleryIcon from "../../assets/svgs/gallery_icon.svg";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { postCoacheeProfile } from "../../redux/CoacheeSlices/submitCoacheeProfileSlice";
import CustomLayout from "../../components/CustomLayout";
import { requestCameraPermission } from "../../utilities/cameraPermission";

const CoacheeProfile = ({ navigation, route }) => {
    const { routeData } = route.params
    const dispatch = useDispatch();
    const [avatarSource, setAvatarSource] = useState(null);
    const [countrySheetVisible, setCountrySheetVisible] = useState(false);
    const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const countries = useSelector(state => state.countries.countries);
    //console.log('countries', countries)
    const status = useSelector(state => state.countries.status);
    const error = useSelector(state => state.countries.error);
    //console.log('error', error)
    const [searchText, setSearchText] = useState("");
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    const [inputValues, setInputValues] = useState({
        firstname: '',
        lastname: '',
        date_of_birth: '',
        phone: ''
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
            handleInputChange(languageId, 'country')
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
        // Fetch countries when the component mounts
        dispatch(fetchCountries());
    }, [dispatch]);

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
                console.log(imageUri);
            }
        });
    }

    //console.log('selectedImage',selectedImage)

    const handleSubmitProfile = () => {

        const newPayload = {
            ...routeData,
            profile_pic: selectedImage,
            first_name: inputValues?.firstname,
            last_name: inputValues?.lastname,
            phone: inputValues?.phone,
            country_id: inputValues?.country,
            date_of_birth: inputValues?.date_of_birth
        }

        console.log('newPayload', newPayload);

        navigation.navigate("CoacheeCoachingAreas", { routeData: newPayload });

        // const imageType = selectedImage.endsWith('.png') ? 'image/png' : 'image/jpeg';

        // const formData = new FormData();
        // formData.append('profile_pic', {
        //     uri: selectedImage,
        //     type: imageType,
        //     name: `image_${Date.now()}.${imageType.split('/')[1]}`,
        // });
        // formData.append('first_name', newPayload?.first_name);
        // formData.append('last_name', newPayload?.last_name);
        // formData.append('phone', newPayload?.phone);
        // formData.append('country_id', newPayload?.country_id);
        // formData.append('date_of_birth', newPayload?.date_of_birth);
        // formData.append('gender', newPayload?.gender);
        // formData.append('role', newPayload?.role);

        // console.log('formData', JSON.stringify(formData));

        // dispatch(postCoacheeProfile(formData)).then((result) => {
        //     console.log(result?.payload)
        // })

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
                        height: hp('65%'),
                        borderTopEndRadius: 16,
                        borderTopStartRadius: 16,
                        padding: 20,
                    }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text
                            style={{
                                fontSize: 18,
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

    return (
        <CustomLayout>
            <SafeAreaView style={styles.container}>
                <HeaderComponent
                    customContainerStyle={{
                        //marginTop: hp("5%"), 
                        marginStart: wp("-3%")
                    }}
                />
                <View style={{ alignItems: "center", marginTop: hp("2%") }}>
                    <Text style={styles.headerTextStyle}>Fill Your Profile</Text>
                    <Text style={styles.descriptionStyle}>
                        Don’t worry, you can always change it later.
                    </Text>
                </View>

                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={handleEditAvatar}>
                        {selectedImage ? <Image
                            source={{ uri: selectedImage }}
                            style={styles.avatar}
                        /> :
                            <Image
                                source={require("../../assets/images/user_profile_dummy.png")}
                                style={{ width: 60, height: 60, top: 20, borderRadius: 30 }}
                            />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.editButton}
                        onPress={() => { setPhotoSheetVisible(true); }}>
                        <EditButton />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputRow}>
                    <CustomInput
                        identifier="firstname"
                        placeholder="First Name"
                        onValueChange={handleInputChange}
                        customContainerStyle={{ flex: 1, marginRight: 10 }}
                    />
                    <CustomInput
                        identifier="lastname"
                        placeholder="Last Name"
                        onValueChange={handleInputChange}
                        customContainerStyle={{ flex: 1, marginLeft: 10 }}
                    />
                </View>

                <CustomInput
                    identifier="date_of_birth"
                    placeholder="Date of Birth"
                    onValueChange={handleInputChange}
                />

                <CustomInput
                    identifier="phone"
                    placeholder="Phone Number"
                    onValueChange={handleInputChange}
                />

                <CustomInput
                    value={getCountryNameById(inputValues?.country)}
                    identifier="country"
                    placeholder="Country"
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

                <CustomButton
                    title={"Next"}
                    customStyle={{ marginTop: hp("15%"), width: wp("85%") }}
                    onPress={() => {
                        handleSubmitProfile()
                        // navigation.navigate("CoacheeCoachingAreas");
                    }}
                />

                {rendercountrySheet()}
                {renderPhotoBottomSheet()}
            </SafeAreaView>
        </CustomLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        margin: 20,
        backgroundColor: "white",
    },
    avatarContainer: {
        width: 80,
        height: 80,
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
        marginTop: hp('4%'),
        backgroundColor: 'rgba(246, 246, 246, 1)',
        borderRadius: 40
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
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
    },
    headerTextStyle: {
        fontFamily: fonts.fontsType.bold,
        fontSize: 24,
        color: 'rgba(49, 40, 2, 1)'
    },
    descriptionStyle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 14,
        color: 'rgba(125, 125, 125, 1)',
        width: wp('100%'),
        textAlign: 'center',
        marginTop: hp('2%'),
    },
});

export default CoacheeProfile;
