import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeTab from "../screens/candidate/Home/HomeTab";
import MyJobTab from "../screens/candidate/MyJob/MyJobTab";
import NotificationTab from "../screens/candidate/Notification/NotificationTab";
import AccountTab from "../screens/candidate/Account/AccountTab";
import { Icon } from "react-native-paper";
import Colors from "../theme/Color";

const Tab = createBottomTabNavigator();

const CandidateTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle:{
            fontSize: 12,
            fontWeight: "bold",
        }
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon source={focused ? "home" : "home-outline"} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="My Jobs"
        component={MyJobTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              source={focused ? "briefcase" : "briefcase-outline"}
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon source={focused ? "bell" : "bell-outline"} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon source={focused ? "account" : "account-outline"} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default CandidateTabs;
