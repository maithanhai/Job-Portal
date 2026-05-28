import React, { useContext } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyUserContext } from "../../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";

import LogoutButton from "../../../components/common/LogoutButton";
import ProfileHeader from "../../../components/common/ProfileHeader";
import SettingItem from "../../../components/common/SettingItem";
import GlobalStyles from "../../../style/Styles";
import ScreenStyles from "./Styles";

const CandidateAccountTab = () => {
    const [user] = useContext(MyUserContext);
    const nav = useNavigation();

    return (
        <SafeAreaView style={ScreenStyles.safeArea} edges={['top']}>
            <ScrollView
                contentContainerStyle={GlobalStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={ScreenStyles.headerBackground} />
                <ProfileHeader 
                    user={user} 
                    onPress={() => nav.navigate("UserDetail")} 
                />

                <View style={ScreenStyles.body}>
                    <View style={GlobalStyles.menuGroup}>
                        <SettingItem title="Hồ sơ của tôi" icon="file-account-outline" onPress={() => nav.navigate("UserDetail")} />
                        <SettingItem title="Đổi mật khẩu" icon="lock-reset" onPress={() => nav.navigate("ChangePassword")} />
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

export default CandidateAccountTab;