import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import Colors from '../../theme/Color';
import Styles from '../../style/Styles';

const ProfileHeader = ({ user, onPress }) => {
    const fullName = user?.last_name 
        ? `Chào bạn, ${user.last_name}`.trim() 
        : (user?.company_name || "Tài khoản của tôi"); 

    const roleText =
        user?.role === "CANDIDATE" ? "Ứng viên" :
        user?.role === "EMPLOYER" ? "Nhà tuyển dụng" : "Khách";

    const avatarUri = user?.avatar;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={Styles.infoCard}
            onPress={onPress}
        >
            <View style={Styles.avatarWrapper}>
                <Avatar.Image
                    size={70}
                    source={avatarUri ? { uri: avatarUri } : require('../../assets/default-avatar.webp')}
                    style={{ backgroundColor: Colors.bg.light }}
                />
            </View>
            <View style={Styles.textContainer}>
                <Text style={Styles.userName} numberOfLines={1}>
                    {fullName}
                </Text>
                <Text style={Styles.userRole}>{roleText}</Text>
            </View>
            <List.Icon icon="chevron-right" color={Colors.white} />
        </TouchableOpacity>
    );
};

export default ProfileHeader;