import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import CandidateTabs from "./CandidateTabs";
import EmployerTabs from "./EmployerTabs";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="CandidateTabs" component={CandidateTabs}/>
            <Stack.Screen name="EmployerTabs" component={EmployerTabs}/>
        </Stack.Navigator>
    )
}

export default AuthStack;