import React, { useContext, useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, Icon } from 'react-native-paper'; 
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { authApis, endpoints } from '../../configs/Apis'; 
import { MyUserContext } from '../../configs/Contexts';
import Colors from '../../theme/Color';
import Styles from './Styles';
import CustomButton from '../common/CustomButton'; 

const VerifyWrapper = ({ children }) => {
    const [user, dispatch] = useContext(MyUserContext); 
    const nav = useNavigation();

    const [checking, setChecking] = useState(false); 

    const checkVerificationStatus = async () => {
        try {
            setChecking(true);
            let token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints["current-employer"]);

            if (res.data.is_verified === true) {
                dispatch({
                    type: "LOGIN", 
                    payload: { ...user, is_verified: true }
                });
                Alert.alert("Thành công", "Tài khoản của bạn đã được xác thực.");
            } else {
                Alert.alert("Thông báo", "Tài khoản của bạn vẫn đang chờ Admin phê duyệt.");
            }
        } catch (ex) {
            Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
        } finally {
            setChecking(false);
        }
    };

    if (user?.role === 'EMPLOYER' && user?.is_verified !== true) {
        return (
            <View style={Styles.container}>
                <Icon source="shield-alert-outline" size={80} color={Colors.status.pending} />
                <Text style={Styles.title}>Đang chờ xác thực</Text>
                <Text style={Styles.desc}>
                    Tài khoản doanh nghiệp của bạn đang trong quá trình chờ quản trị viên phê duyệt hoặc cần bổ sung thông tin.
                </Text>

                <CustomButton 
                    title="Cập nhật hồ sơ ngay"
                    mode="contained" 
                    onPress={() => nav.navigate("EmployerProfile")}
                    buttonColor={Colors.primary}
                    style={Styles.updateBtn}
                />

                <CustomButton 
                    title="Kiểm tra trạng thái duyệt"
                    mode="outlined" 
                    onPress={checkVerificationStatus}
                    textColor={Colors.primary}
                    style={{ marginTop: 10, borderColor: Colors.primary }}
                    loading={checking}
                    disabled={checking}
                />
            </View>
        );
    }

    return <>{children}</>;
};

export default VerifyWrapper;