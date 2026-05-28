import React, { useContext } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyUserContext } from "../../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import LogoutButton from "../../../components/common/LogoutButton";
import ProfileHeader from "../../../components/common/ProfileHeader";
import SettingItem from "../../../components/common/SettingItem";
import GlobalStyles from "../../../style/Styles";
import ScreenStyles from "./Styles";

const EmployerAccountTab = () => {
    const [user] = useContext(MyUserContext);
    const nav = useNavigation();

    return (
        <SafeAreaView style={ScreenStyles.safeArea} edges={['top']}>
            <ScrollView
                contentContainerStyle={ScreenStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >

                <View style={ScreenStyles.greenBackground} />
                <View style={{ zIndex: 1 }}>
                    <ProfileHeader user={user} onPress={() => nav.navigate("UserDetail")} />
                </View>

                <View style={ScreenStyles.body}>
                    <View style={GlobalStyles.menuGroup}>
                        <SettingItem title="Hồ sơ cá nhân" icon="account-outline" onPress={() => nav.navigate("UserDetail")} />
                        <SettingItem title="Đổi mật khẩu" icon="lock-reset" onPress={() => nav.navigate("ChangePassword")} />
                        <SettingItem title="Thông tin xác thực Doanh nghiệp" icon="check-decagram" onPress={() => nav.navigate("EmployerProfile")} />
                    </View>
                </View>

                <View style={GlobalStyles.spacer} />

                <View style={ScreenStyles.logoutContainer}>
                    <LogoutButton />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EmployerAccountTab;