import React, { useContext } from "react";
import { List } from "react-native-paper";
import { View, Alert } from "react-native"; 
import { MyUserContext } from "../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogoutButton = () => {
    const [user, dispatch] = useContext(MyUserContext);

    const HandleLogout = () => {
        Alert.alert(
            "Xác nhận", 
            "Bạn có chắc chắn muốn đăng xuất không?", 
            [
                { text: "Hủy", style: "cancel" },
                { 
                    text: "Đăng xuất", 
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("user");
                            await AsyncStorage.removeItem("token");
                            dispatch({ type: "LOGOUT" }); 
                            console.log("Đăng xuất thành công");
                        } catch (ex) {
                            console.error("Lỗi khi đăng xuất:", ex);
                        }
                    } 
                }
            ]
        );
    };

    return (
        <List.Item
            title="Đăng xuất"
            left={props => <List.Icon {...props} icon="logout" color="red" />}
            titleStyle={{ color: 'red', fontWeight: 'bold' }}
            onPress={HandleLogout}
        />
    );
};

export default LogoutButton; 