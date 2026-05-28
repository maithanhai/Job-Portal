import { NavigationContainer } from "@react-navigation/native";
import { MyUserContext } from "./configs/Contexts";
import React, { useEffect, useReducer, useState } from "react";
import MyUserReducer from "./reducers/reducers";
import { Icon, Provider as PaperProvider } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from 'react-native-safe-area-context'; // 1. IMPORT THÊM ĐOẠN NÀY
import Colors from "./theme/Color";

import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";

import HomeCandidateTab from "./screens/candidate/home/HomeCandidateTab";
import SavedJobsTab from "./screens/candidate/savedjob/SavedJobsTab";
import ApplicationsTab from "./screens/candidate/application/ApplicationsTab";
import CandidateAccountTab from "./screens/candidate/account/CandidateAccountTab";
import UserDetail from "./components/common/UserDetail";
import ChangePassword from "./screens/auth/ChangePassword";
import MyJobsTab from "./screens/employer/myjob/MyJobsTab";
import CandidatesTab from "./screens/employer/candidate/CandidatesTab";
import EmployerAccountTab from "./screens/employer/account/EmployerAccountTab";
import JobDetail from "./components/common/JobDetail";
import EmployerProfile from "./screens/employer/account/EmployerProfile";
import JobForm from "./screens/employer/myjob/JobForm";
import CandidateDetail from "./screens/employer/candidate/CandidateDetail";
import CompareJobs from "./screens/candidate/home/CompareJobs";
import HomeEmployerTab from "./screens/employer/home/HomeEmployerTab";
import ApplicationDetail from "./screens/candidate/application/ApplicationDetail";

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
      initialRouteName="Trang chủ"
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeCandidateTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "home" : "home-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Đã lưu"
        component={SavedJobsTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "heart" : "heart-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Đơn ứng tuyển"
        component={ApplicationsTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "file-document" : "file-document-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tài khoản"
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
      initialRouteName="Trang chủ"
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeEmployerTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "home" : "home-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Công việc"
        component={MyJobsTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "briefcase" : "briefcase-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Ứng viên"
        component={CandidatesTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "account-group" : "account-group-outline"} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tài khoản"
        component={EmployerAccountTab}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon source={focused ? "account" : "account-outline"} size={30} color={color} />
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
    <SafeAreaProvider>
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
                <Stack.Screen
                  name="EmployerProfile"
                  component={EmployerProfile}
                  options={{ title: "Thông tin xác thực Doanh nghiệp" }}
                />
                <Stack.Screen
                  name="JobForm"
                  component={JobForm}
                  options={{ title: "Thông tin tuyển dụng" }}
                />
                <Stack.Screen
                  name="CandidateDetail"
                  component={CandidateDetail}
                  options={{ title: "Chi tiết ứng viên" }}
                />
                <Stack.Screen
                  name="CompareJobs"
                  component={CompareJobs}
                  options={{ title: "So sánh công việc" }}
                />
                <Stack.Screen
                  name="ApplicationDetail"
                  component={ApplicationDetail}
                  options={{ title: "Chi tiết đơn ứng tuyển" }}
                />
              </Stack.Navigator>
            )}
          </NavigationContainer>
        </PaperProvider>
      </MyUserContext.Provider>
    </SafeAreaProvider>
  );
};

export default App;