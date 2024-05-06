import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomBottomTabBar from '../components/CustomBottomBar';
import Explore from '../screens/BottomTabScreen/Explore';
import Setting from '../screens/BottomTabScreen/Setting';
import Chat from '../screens/BottomTabScreen/Chat';
import Presentation from '../screens/BottomTabScreen/Presentation';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { role } = useSelector((state) => state.userLogin)
  const icons = [
    (role === 'coachee') ? require('../assets/images/explore_src_img.png') : require('../assets/images/coach_home_icon.png'),
    require('../assets/images/presentation_src_img.png'),
    require('../assets/images/chat_src_img.png'),
    require('../assets/images/setting_src_img.png'),
  ];

  return (
    <Tab.Navigator tabBar={(props) => <CustomBottomTabBar {...props} icons={icons} />}>
      <Tab.Screen name="Explore" component={Explore}
        options={{
          headerShown: false, title: role === 'coachee' ? 'Explore' : 'Home',
          //icon: <Image source={require('../assets/images/explore_src_img.png')} />
        }} />
      <Tab.Screen name="MyCoaching" component={Presentation}
        options={{
          headerShown: false, title: role === 'coachee' ? 'My Coaching' : 'My Sessions',
          //icon: <Image source={require('../assets/images/presentation_src_img.png')} />
        }} />
      <Tab.Screen name="Chat" component={Chat}
        options={{
          headerShown: false, title: 'Chat',
          //icon: <Image source={require('../assets/images/chat_src_img.png')} />
        }} />
      <Tab.Screen name="Setting" component={Setting}
        options={{
          headerShown: false, title: 'Setting',
          //icon: <Image source={require('../assets/images/setting_src_img.png')} />
        }} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
