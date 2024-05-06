import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import fonts from '../../theme/fonts';
import HeaderComponent from '../../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../../redux/coachSlices/coachingAreaSlices';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomButton from '../../components/ButtonComponent';
import FullScreenLoader from '../../components/CustomLoader';
import CustomCheckbox from '../../components/CustomCheckbox';
import { postCoacheeProfile } from '../../redux/CoacheeSlices/submitCoacheeProfileSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import CustomSnackbar from '../../components/CustomToast';
import { storeData } from '../../utilities/localStorage';

const CoacheeCoachingAreas = ({ navigation, route }) => {
    const { routeData } = route.params
    const dispatch = useDispatch();
    const coachingAreasList = useSelector((state) => state.coachingAreas.coachingAreasList);
    const cocaheeStatus = useSelector((state) => state.coacheeProfile.status);
    const status = useSelector((state) => state.coachingAreas.status);
    const error = useSelector((state) => state.coachingAreas.error);
    const [searchText, setSearchText] = useState('');
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [toastType, setToastType] = useState('');


    const handleCheckboxClick = (areaId) => {
        const isSelected = selectedAreas.includes(areaId);
        if (isSelected) {
            setSelectedAreas((prevSelected) =>
                prevSelected.filter((id) => id !== areaId)
            );
        } else {
            setSelectedAreas((prevSelected) => [...prevSelected, areaId]);
        }
    };

    const handleCheckboxToggle = () => {
        //console.log('Checkbox is now:', isChecked ? 'checked' : 'unchecked');
        // Perform any other actions based on the checkbox state
    };


    useEffect(() => {
        // Fetch Areas when the component mounts
        dispatch(fetchAreas()).then((result) => {
            console.log(result)
        });
    }, [dispatch]);


    const handleSubmitProfile = () => {

        const newPayload = {
            ...routeData,
            interests: selectedAreas,
        }

        //console.log('newPayload', newPayload);
        const objectConverted = "{" + selectedAreas.join(",") + "}";
        const imageType = newPayload?.profile_pic.endsWith('.png') ? 'image/png' : 'image/jpeg';

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
        formData.append('gender', newPayload?.gender);
        formData.append('role', newPayload?.role);
        formData.append('interests', objectConverted);
        // formData.append('interests', newPayload?.interests);

        //console.log('formData', JSON.stringify(formData));

        dispatch(postCoacheeProfile(formData)).then((result) => {
            console.log('resultCoachee', result?.payload);
            if (result?.payload?.success == true) {
                renderSuccessMessage(result?.payload?.message, result)

            } else {
                renderErrorMessage(result?.payload?.message ? result?.payload?.message
                    : 'Network Error')
            }
        })

    }

    async function delayAndStoreData(result) {

        await storeData('userData', result?.payload);
    }

    const renderSuccessMessage = async (message, result) => {

        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')
        delayAndStoreData(result)
        setTimeout(async () => {

            resetNavigation(navigation, "CoacheeProfileCompletion");
        }, 3000);

    }

    const renderErrorMessage = (message) => {

        setMessage('Error')
        setDescription(message)
        setIsVisible(true);
        setToastType('error')
    }


    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }

    const renderToastMessage = () => {
        return <CustomSnackbar visible={isVisible} message={message}
            messageDescription={description}
            onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
    }


    const renderLanguageItem = ({ item }) => (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center', marginVertical: 5,
            backgroundColor: 'rgba(241, 241, 241, 1)',
            borderRadius: 12,
            height: 52
        }}>
            <Image
                style={{ height: 22, width: 22, marginStart: 10, }}
                source={{ uri: item.icon }}
            />
            <Text style={{
                flex: 1, fontFamily: fonts.fontsType.medium,
                fontSize: 14, color: 'rgba(118, 118, 118, 1)', marginStart: 10
            }}>{item.name}</Text>
            {/* <CheckBox
                value={selectedAreas.includes(item.id)}
                onValueChange={() => handleCheckboxClick(item.id)}
                boxType={'square'}
                onCheckColor='white'
                tintColor='rgba(204, 204, 204, 1)'
                onTintColor='rgba(15, 109, 106, 1)'
                onFillColor='rgba(15, 109, 106, 1)'
                tintColors={{ true: 'rgba(15, 109, 106, 1)', false: 'rgba(204, 204, 204, 1)' }}
                style={{ marginEnd: 5, }}
            /> */}

            <CustomCheckbox
                checkedColor="rgba(15, 109, 106, 1)"
                uncheckedColor="rgba(238, 238, 238, 1)"
                onToggle={() => { handleCheckboxClick(item.id) }}
                customStyle={{ borderColor: 'rgba(187, 187, 187, 1)', borderWidth: 0.5 }}
            />

        </View>
    );


    // console.log('coachingAreasList', coachingAreasList);
    console.log('selectedAreas', selectedAreas);
    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <HeaderComponent
                customContainerStyle={{
                    //marginTop: hp('5%'),
                    marginStart: 10
                }} />
            {renderToastMessage()}
            <Text style={{
                fontFamily: fonts.fontsType.bold,
                fontSize: 24,
                color: 'rgba(49, 40, 2, 1)',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
                width: wp('70%')
            }}>Which areas are you interested in?</Text>

            <View style={{ padding: 20, marginTop: hp('2%'), flex: 2 }}>

                <FlatList
                    data={coachingAreasList?.coachAreas?.filter((language) =>
                        language.name.toLowerCase().includes(searchText.toLowerCase())
                    )}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderLanguageItem}
                    keyExtractor={(item) => item.id.toString()}
                />
                <CustomButton
                    loading={cocaheeStatus === 'loading' ? true : false}
                    onPress={() => {
                        handleSubmitProfile()
                        //navigation.navigate('CoacheeProfileCompletion')
                    }}
                    title={'Next'}
                    customStyle={{ marginBottom: -0 }} />

            </View>



        </SafeAreaView>
    );
};

export default CoacheeCoachingAreas;
