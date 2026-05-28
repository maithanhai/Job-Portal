import React, { useContext, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelperText } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts";
import CustomInput from "../../components/common/CustomInput"; 
import CustomButton from "../../components/common/CustomButton"; 
import Colors from "../../theme/Color";
import GlobalStyles from "../../style/Styles";
import ScreenStyles from "./Styles";

const Login = () => {
    const userInfo = [
        { field: 'username', label: 'Tên đăng nhập', icon: 'account' }, 
        { field: 'password', label: 'Mật khẩu', icon: 'lock', isPassword: true }
    ];

    const [user, setUser] = useState({});
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [, dispatch] = useContext(MyUserContext);
    const nav = useNavigation();
    
    const change = (field, value) => {
        setUser(current => ({...current, [field]: value}));
    }

    const validate = () => {
        for (let i of userInfo) {
            if (!user[i.field]) {
                setErr(`Vui lòng nhập đầy đủ ${i.label.toLowerCase()}!`);
                return false;
            }
        }
        return true;
    }

    const login = async () => {
        if (!validate()) return;
        setErr("");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', user.username);
            formData.append('password', user.password);
            formData.append('client_id', 'sAlOJlY4I6znBv8I02YUOGEnB3BgbHfjM8v2702b');
            formData.append('client_secret', 'Tm9mRyYIRcKvTq5YVu35TLG6HWKMTkX9OzY6j54V8QuaHHjUBhBPkA2UdEAHuZj816bDmg4V3v5Bez0jCy9Zd83Ky1M8KjZy6IW0RvxiFzoY1pnDcRaPONDjXLQPDLbq');
            formData.append('grant_type', 'password');

            let res = await Apis.post(endpoints['login'], formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            await AsyncStorage.setItem('token', res.data.access_token);

            let u = await authApis(res.data.access_token).get(endpoints['current-user']);
            let userData = u.data;

            if (userData.role === 'EMPLOYER') {
                try {
                    let empRes = await authApis(res.data.access_token).get(endpoints['current-employer']);
                    userData.is_verified = empRes.data.is_verified; 
                } catch (e) {
                    userData.is_verified = false;
                }
            } else {
                userData.is_verified = true; 
            }

            dispatch({ "type": "LOGIN", "payload": userData });
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            
        } catch (ex) {
            setErr("Tên đăng nhập hoặc mật khẩu không đúng!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={ScreenStyles.safeArea}>
            <ScrollView contentContainerStyle={ScreenStyles.loginScroll} keyboardShouldPersistTaps="handled">
                <View style={GlobalStyles.padding}>
                    <Text style={GlobalStyles.title}>ĐĂNG NHẬP</Text>

                    {err ? <HelperText type="error" visible={true}>{err}</HelperText> : null}

                    {userInfo.map(i => (
                        <CustomInput 
                            key={i.field}
                            label={i.label}
                            icon={i.icon}
                            value={user[i.field] || ""}
                            onChangeText={t => change(i.field, t)}
                            isPassword={i.isPassword}
                            autoCapitalize="none"
                        />
                    ))}

                    <CustomButton title="ĐĂNG NHẬP" onPress={login} loading={loading} />

                    <View style={GlobalStyles.rowCenter}>
                        <Text style={ScreenStyles.signupPromptText}>Chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => nav.navigate("Register")}>
                            <Text style={GlobalStyles.linkText}>Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Login;