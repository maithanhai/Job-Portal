import React, { useContext } from "react";
import { View, ScrollView } from "react-native";
import { MyUserContext } from "../../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import LogoutButton from "../../../components/common/LogoutButton";
import ProfileHeader from "../../../components/common/ProfileHeader";
import SettingItem from "../../../components/common/SettingItem";
import styles from "../../../style/Styles";

const EmployerAccountTab = () => {
    const [user] = useContext(MyUserContext);
    const nav = useNavigation();

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            style={styles.container}
        >
            <View style={styles.greenBackground} />

            <ProfileHeader 
                user={user} 
                onPress={() => nav.navigate("UserDetail")} 
            />

            <View style={styles.body}>
                <View style={styles.menuGroup}>
                    <SettingItem 
                        title="Hồ sơ cá nhân" 
                        icon="account-outline" 
                        onPress={() => nav.navigate("UserDetail")} 
                    />
                    <SettingItem 
                        title="Đổi mật khẩu" 
                        icon="lock-reset" 
                        onPress={() => nav.navigate("ChangePassword")} 
                    />
                    <SettingItem 
                        title="Hồ sơ công ty" 
                        icon="domain" 
                        onPress={() => {}} 
                    />
                    <SettingItem 
                        title="Quản lý tin đăng" 
                        icon="clipboard-list-outline" 
                        onPress={() => {}} 
                    />
                    <SettingItem 
                        title="Gói dịch vụ & Thanh toán" 
                        icon="credit-card-outline" 
                        onPress={() => {}} 
                        hideDivider={true} 
                    />
                </View>
            </View>

            <View style={styles.spacer} />

            <View style={styles.logoutBox}>
                <LogoutButton />
            </View>
        </ScrollView>
    );
};

export default EmployerAccountTab;