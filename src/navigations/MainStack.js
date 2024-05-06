import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import BottomTabNavigator from './TabNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from '../redux/authSlices/userLoginSlice';
import { getData } from '../utilities/localStorage';
import DashboardScreens from './DashboardScreens';

const MainStack = () => {

  const dispatch = useDispatch();
  // const token = useSelector(state => state.auth.token);
  const token = useSelector(state => state.userLogin.token);
  //console.log('token', token);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await getData('token');
        const userData = await getData('userData');
        if (storedToken) {
          dispatch(resetState({ 
            token: storedToken, 
            role: userData?.user?.role,
            user_name : `${userData?.user?.first_name} ${userData?.user?.last_name}`,
            user_id: userData?.user?.id || userData?.user?.user_id, //TODO check the login id
             }))
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    checkToken();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {token ? <DashboardScreens /> : <AppNavigator />}
      {/* {token ? <BottomTabNavigator /> : <AppNavigator /> } */}
    </NavigationContainer>
  );
};

export default MainStack;
