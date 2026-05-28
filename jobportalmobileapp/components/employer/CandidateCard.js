import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card, Avatar, Text } from 'react-native-paper';
import Colors from '../../theme/Color';
import ComponentStyles from './Styles';

const CandidateCard = ({ item, onUpdateStatus }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'ACCEPTED': return { color: Colors.status.accepted, label: 'Chấp nhận' };
            case 'REJECTED': return { color: Colors.status.rejected, label: 'Từ chối' };
            case 'REVIEWING': return { color: Colors.status.reviewing, label: 'Đang xem' };
            default: return { color: Colors.status.pending, label: 'Chờ duyệt' };
        }
    };

    const statusConfig = getStatusConfig(item.status);

    return (
        <TouchableOpacity onPress={onUpdateStatus} activeOpacity={0.8}>
            <Card style={ComponentStyles.candidateCard}>
                <Card.Title 
                    title={`${item.full_name}`}
                    titleStyle={ComponentStyles.candidateCardTitle}
                    subtitle={`Ứng tuyển: ${item.job_name || "Vị trí ẩn"}`}
                    subtitleStyle={ComponentStyles.candidateCardSubtitle}
                    left={(props) => <Avatar.Image {...props} source={item.avatar? {uri: item.avatar}:require("../../assets/default-avatar.webp") } />}
                />

                <View style={[ComponentStyles.candidateCardBadge, { backgroundColor: statusConfig.color + '20' }]}>
                    <Text style={{ color: statusConfig.color, fontWeight: 'bold', fontSize: 11 }}>
                        {statusConfig.label}
                    </Text>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

export default CandidateCard;