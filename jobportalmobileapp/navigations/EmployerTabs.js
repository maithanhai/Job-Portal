import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardTab from "../screens/employer/Dashboard/DashboardTab";
import MyJobTab from "../screens/employer/MyJob/MyJobTab";
import NotificationTab from "../screens/employer/Notification/NotificationTab";
import AccountTab from "../screens/employer/Account/AccountTab";
import CandidateTab from "../screens/employer/Candidate/CandidateTab";
import { Icon } from "react-native-paper";
import Colors from "../theme/Color";

const Tab = createBottomTabNavigator();

const EmployerTabs = () => {
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
      initialRouteName="Dashboard"
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardTab}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Icon
              source={focused ? "view-dashboard" : "view-dashboard-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="My Jobs"
        component={MyJobTab}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Icon
              source={focused ? "briefcase" : "briefcase-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Candidates"
        component={CandidateTab}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Icon source={focused ? "account-group" : "account-group-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationTab}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Icon source={focused ? "bell" : "bell-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountTab}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Icon source={focused ? "cog" : "cog-outline"} size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default EmployerTabs;
