import { PermissionsAndroid, Alert, Linking } from 'react-native'; // Import PermissionsAndroid from 'react-native'

function showPermissionSettingsAlert(permissionType) {
    Alert.alert(
      `${permissionType} Permission Denied`,
      `To enable ${permissionType.toLowerCase()} access, please go to Settings and allow ${permissionType.toLowerCase()} permissions.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Settings', onPress: () => openAppSettings() },
      ],
      { cancelable: false }
    );
  }

  function openAppSettings() {
    // Open app settings
    Linking.openSettings();
  }

export async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Camera permission granted');
    } else {
      console.log('Camera permission denied');
      showPermissionSettingsAlert("Camera")
    }
  } catch (err) {
    console.warn(err);
  }
}
