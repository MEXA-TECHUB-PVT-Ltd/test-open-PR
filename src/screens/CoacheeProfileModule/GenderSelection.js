import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can change this to your preferred icon library
import fonts from '../../theme/fonts';
import HeaderComponent from '../../components/HeaderComponent';
import HorizontalDivider from '../../components/DividerLine';
import CustomButton from '../../components/ButtonComponent';
import { resetNavigation } from '../../utilities/resetNavigation';

const GenderSelectionScreen = ({ navigation, route }) => {
    const { routeData } = route.params;
    console.log('fff', routeData);
    const [selectedGender, setSelectedGender] = useState(null);

    const handleGenderSelection = (gender) => {
        setSelectedGender(gender);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

            <HeaderComponent customContainerStyle={{ marginStart: 20 }} />
            <Text style={{
                fontFamily: fonts.fontsType.bold,
                fontSize: 22,
                color: 'rgba(49, 40, 2, 1)',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
            }}>Tell Us About Yourself</Text>

            <Text style={{
                fontFamily: fonts.fontsType.medium,
                fontSize: 14,
                color: '#7D7D7D',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 10,
                width: '80%'
            }}>To give you a better experience and results we need to know your gender</Text>

            <HorizontalDivider height={1} customStyle={{ width: '90%', alignSelf: 'center', marginTop: 50 }} />

            <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white', marginTop: 50 }}>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        borderWidth: 1,
                        borderColor: selectedGender === 'male' ? 'rgba(15, 109, 106, 1)' : 'rgba(0, 0, 0, 0.17)',
                        overflow: 'hidden',
                    }}
                    onPress={() => handleGenderSelection('male')}
                >
                    <LinearGradient
                        colors={[selectedGender === 'male'  ? '#073F3D' : '#fff', selectedGender === 'male' ?  'rgba(15, 109, 106, 1)' : '#FFF']}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            borderRadius: 60,
                        }}
                    >
                        <Icon name="mars" size={50} color="rgba(121, 121, 121, 1)" />
                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            color: selectedGender === 'male' ? '#FFF' : 'rgba(121, 121, 121, 1)',
                            fontSize: 14,
                            marginTop: 10
                        }}>Male</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 120,
                        height: 120,
                        borderRadius: 75,
                        borderWidth: 1,
                        borderColor: selectedGender === 'female' ? 'rgba(15, 109, 106, 1)' : 'rgba(0, 0, 0, 0.17)',
                        overflow: 'hidden',
                    }}
                    onPress={() => handleGenderSelection('female')}
                >
                    <LinearGradient
                        colors={[selectedGender === 'female'  ? '#073F3D' : '#fff', selectedGender === 'female' ?  'rgba(15, 109, 106, 1)' : '#FFF']}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            borderRadius: 75,
                        }}
                    >
                        <Icon name="venus" size={50} color="rgba(121, 121, 121, 1)" />
                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            color: selectedGender === 'female' ? '#FFF' : 'rgba(121, 121, 121, 1)',
                            fontSize: 14,
                            marginTop: 10
                        }}>Female</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <CustomButton
                onPress={() => { navigation.navigate('CoacheeProfile', { routeData: { ...routeData, gender: selectedGender } }) }}
                title={'Next'}
                customStyle={{ marginBottom: 40 }} />

        </SafeAreaView>
    );
};

export default GenderSelectionScreen;
