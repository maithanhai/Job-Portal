import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChooseRole from "../screens/auth/ChooseRole";
import Login from "../screens/auth/Login";
import RegisterCandidate from "../screens/auth/RegisterCandidate";
import RegisterEmployer from "../screens/auth/RegisterEmployer";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ChooseRole" component={ChooseRole} />
            <Stack.Screen name="RegisterCandidate" component={RegisterCandidate} />
            <Stack.Screen name="RegisterEmployer" component={RegisterEmployer} />
        </Stack.Navigator>
    )
}

export default AuthStack;