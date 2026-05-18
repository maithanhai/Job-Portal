import { NavigationContainer } from "@react-navigation/native";
import { MyUserContext } from "./configs/Contexts";
import React, { useEffect, useReducer, useState } from "react";
import MyUserReducer from "./reducers/reducers";
import { Icon, Provider as PaperProvider } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "./theme/Color";

import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";

import HomeTab from "./screens/candidate/Home/HomeTab";
import SavedJobsTab from "./screens/candidate/SavedJobs/SavedJobsTab";
import ApplicationsTab from "./screens/candidate/Applications/ApplicationsTab";
import CandidateAccountTab from "./screens/candidate/Account/CandidateAccountTab";
import UserDetail from "./components/common/UserDetail";
import ChangePassword from "./components/common/ChangePassword";

import DashboardTab from "./screens/employer/Dashboard/DashboardTab";
import MyJobsTab from "./screens/employer/MyJobs/MyJobsTab";
import CandidatesTab from "./screens/employer/Candidates/CandidatesTab";
import EmployerAccountTab from "./screens/employer/Account/EmployerAccountTab";
import JobDetail from "./screens/candidate/Home/JobDetail";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};

const CandidateTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "home" : "home-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved Jobs"
        component={SavedJobsTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "heart" : "heart-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "file-document" : "file-document-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={CandidateAccountTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "account" : "account-outline"} size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const EmployerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
      initialRouteName="Dashboard"
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "view-dashboard" : "view-dashboard-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My Jobs"
        component={MyJobsTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "briefcase" : "briefcase-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Candidates"
        component={CandidatesTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "account-group" : "account-group-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={EmployerAccountTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "domain" : "domain"} size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("user");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          dispatch({
            type: "LOGIN",
            payload: userData,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsReady(true);
      }
    };
    loadUserFromStorage();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <PaperProvider>
        <NavigationContainer>
          {user === null ? (
            <AuthStack />
          ) : (
            <Stack.Navigator>
              {user.role === "CANDIDATE" ? (
                <Stack.Screen
                  name="MainTabs"
                  component={CandidateTabs}
                  options={{ headerShown: false }}
                />
              ) : (
                <Stack.Screen
                  name="MainTabs"
                  component={EmployerTabs}
                  options={{ headerShown: false }}
                />
              )}
              <Stack.Screen
                name="UserDetail"
                component={UserDetail}
                options={{ title: "Hồ sơ cá nhân" }}
              />
              <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{ title: "Đổi mật khẩu" }}
              />
              <Stack.Screen
                name="JobDetail"
                component={JobDetail}
                options={{ title: "Chi tiết công việc" }}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </PaperProvider>
    </MyUserContext.Provider>
  );
};

export default App;