import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import Styles from "./Styles"; 
import { HelperText } from "react-native-paper";
import { useContext, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyUserContext } from "../../configs/Contexts";
import CustomInput from "../../components/common/CustomInput"; 
import CustomButton from "../../components/common/CustomButton"; 
import { useNavigation } from "@react-navigation/native";

const Login = () => {
    const userInfo = [{
        field: 'username',
        label: 'Tên đăng nhập',
        icon: 'account'
    }, {
        field: 'password',
        label: 'Mật khẩu',
        icon: 'lock',
        isPassword: true 
    }];

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
        if (validate()) {
            setErr("");
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('username', user.username);
                formData.append('password', user.password);
                formData.append('client_id', 'oK57ivAKGWDmJDE4Qti7nSCAsnmcBDLBl4M5rvwr');
                formData.append('client_secret', '3MjKDP3sOY9qX6xDdMR6ninUz7W7mtBDg0liqkuEs6kAe7ukOSZ9WBuuBrX86RgUS0JCLWBaLa0LiCSYJDwjS5M0OIVGQGdUXBeVRg7gg2GJDA2lR5cZoGoRvFYOhYNL');
                formData.append('grant_type', 'password');

                let res = await Apis.post(endpoints['login'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                await AsyncStorage.setItem('token', res.data.access_token);
        
                let u = await authApis(res.data.access_token).get(endpoints['current-user']);
                
                // Cap nhat user vao Context
                dispatch({
                    "type": "LOGIN",
                    "payload": u.data
                });

                await AsyncStorage.setItem('user', JSON.stringify(u.data));

                
                console.info("Đăng nhập thành công!");

            } catch (ex) {
                console.error("Lỗi Login:", ex.response?.data || ex.message);
                setErr("Tên đăng nhập hoặc mật khẩu không đúng!");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView style={Styles.container} keyboardShouldPersistTaps="handled">
            <View style={Styles.padding}>
                <Text style={Styles.title}>ĐĂNG NHẬP</Text>

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

                <CustomButton 
                    title="ĐĂNG NHẬP" 
                    onPress={login} 
                    loading={loading}
                />

                <View style={Styles.rowCenter}>
                    <Text>Chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={() => nav.navigate("Register")}>
                        <Text style={Styles.linkText}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export default Login;