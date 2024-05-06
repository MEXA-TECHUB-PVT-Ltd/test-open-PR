import React, { useState, useEffect, useRef } from 'react';
import { View, BackHandler, TouchableOpacity, Text, SafeAreaView, StyleSheet } from 'react-native'; // Import TouchableOpacity and Text
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { createPaymentAccount } from '../../redux/paymentMethod/createAccountLinkSlice';
import FullScreenLoader from '../../components/CustomLoader';
import BackArrow from '../../assets/svgs/backArrow.svg'
import { resetNavigation } from '../../utilities/resetNavigation';
import { verifyAccountStatus } from '../../redux/paymentMethod/verifyAccountStatusSlice';
import queryString from 'query-string';
import { storeData } from '../../utilities/localStorage';
import { postCoacheeProfile } from '../../redux/CoacheeSlices/submitCoacheeProfileSlice';

const CreateStripeAccount = ({ navigation }) => {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.createAccountLink);
    const [webViewUrl, setWebViewUrl] = useState(null);
    const webViewRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        dispatch(createPaymentAccount()).then((result) => {
            //console.log('result', result?.payload);
            if (result?.payload?.success === true) {
                setWebViewUrl(result?.payload?.result?.url);
            }
        });
    }, [dispatch]);

    const parseResponseDataTest = (url) => {
        const parsed = queryString.parseUrl(url);
        const { query } = parsed;
        return query;
    };


    const parseResponseData = (url) => {
        const urlParts = url.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        const secondLastPart = urlParts[urlParts.length - 2];
        let accountId = null;
        let uniqueIdentifier = null;
        let query = {};

        if (lastPart.includes('?')) {
            const parsed = queryString.parseUrl(url);
            query = parsed.query;
        } else {
            accountId = secondLastPart;
            uniqueIdentifier = lastPart;
        }

        return { accountId, uniqueIdentifier, query };
    };

    const handleBackButton = () => {
        if (webViewRef.current && webViewRef.current.canGoBack()) {
            webViewRef.current.goBack();
            return true;
        }
        return false;
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);

    //update stripe status to coach profile 

    async function delayAndStoreData(result) {

        await storeData('userData', result);
    }

    const handleSubmitProfile = () => {

        const formData = new FormData();
        formData.append('role', "coach");
        formData.append('is_stripe_completed', true);

        console.log(formData)

        dispatch(postCoacheeProfile(formData)).then((result) => {
            console.log('result stripe signup---> coach', result?.payload);
            if (result?.payload?.success == true) {
                const { first_name, last_name, role, user_id } = result?.payload?.data;

                const user = {
                    first_name: first_name,
                    last_name: last_name,
                    role: role,
                    id: user_id,
                    user_id: user_id
                };

                // Now you can use this user object within another object in your React Native application
                console.log({ user });
                delayAndStoreData({ user })
                setTimeout(() => {
                    resetNavigation(navigation, "CoachProfileCompletion")
                }, 3000);
            } else {
                console.log('updating stripe status error', result?.payload?.message)
            }
        })
    }

    const handleWebViewNavigationStateChange = (newNavState) => {
        console.log('newNavState', newNavState);
        const { url } = newNavState;
        let responseData = {};

        // Parse response data based on URL structure
        if (url.startsWith('https://connect.stripe.com/setup/s')) {
            responseData = parseResponseData(url);
        } else if (url.startsWith('http://localhost:3001/coach-profile-complete')) {
            //responseData = parseResponseDataTest(url);
            responseData = parseResponseData(url);
        }

        console.log('Parsed response data:', responseData);

        // Check if responseData contains required information for verification
        // if (responseData?.accountId && responseData?.uniqueIdentifier) {
        if (responseData) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                // Call verifyAccount API with responseData
                verifyAccount(responseData);
            }, 500); // Adjust the debounce delay as needed
        }
    };

    const verifyFilledDetail = (payload) => {
        const { result } = payload;

        // Check if all keys except eventually_due are filled
        const areKeysFilled = Object.keys(result).every(key => {
            // Exclude eventually_due key
            if (key === 'eventually_due') return true;

            // Check if the value is an array and is not empty
            if (Array.isArray(result[key])) {
                return result[key].length === 0;
            }
            // Check if the value is not null
            return result[key] == null;
        });

        return areKeysFilled;
    };


    const verifyAccount = (data) => {
        // Make API call here with the extracted data
        console.log('Calling API with data:', data);
        dispatch(verifyAccountStatus({
            account_id: data?.accountId != null ? data?.accountId : data?.query?.account_id
        })).then((result) => {
            console.log('verify Account result', result?.payload);
            const isVerified = verifyFilledDetail(result?.payload)
            console.log('isVerified', isVerified)
            if (isVerified) {
                console.log('API triggered')
                handleSubmitProfile();
                // setTimeout(() => {
                //     resetNavigation(navigation, "CoachProfileCompletion")
                // }, 3000);
            } else {
                console.log('Your account detail is not filled.')
            }
        })
    };

    if (status === 'loading') {
        return <FullScreenLoader visible={status === 'loading'} />;
    }

    const renderWebView = () => {
        if (!webViewUrl) {
            return <Text>No URL available</Text>;
        }

        return (
            <WebView
                ref={webViewRef}
                source={{ uri: webViewUrl && webViewUrl }}
                incognito={true}
                cacheEnabled={false}
                onNavigationStateChange={handleWebViewNavigationStateChange}
            />
        );
    };


    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        resetNavigation(navigation, "SignIn")
                        // if (!webViewRef.current.goBack()) {
                        //     resetNavigation(navigation, "SignIn")
                        // }
                    }}
                // disabled={!webViewRef.current}
                >
                    <BackArrow />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => webViewRef.current.goForward()} disabled={!webViewRef.current}>
                    <Text style={styles.buttonText}>Forward</Text>
                </TouchableOpacity> */}
            </View>
            {renderWebView()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    buttonContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginTop: 20
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});


export default CreateStripeAccount;
