import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/vi';
import Colors from '../../theme/Color';

const ApplicationCard = ({ item, onJobPress }) => {
    // Hàm quy đổi trạng thái sang text và màu sắc
    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING':
                return { text: "Chờ duyệt", color: "#f39c12" };
            case 'REVIEWING':
                return { text: "Đang xem xét", color: "#3498db" };
            case 'ACCEPTED':
                return { text: "Chấp nhận", color: "#27ae60" };
            case 'REJECTED':
                return { text: "Từ chối", color: "#e74c3c" };
            default:
                return { text: "Không rõ", color: "#7f8c8d" };
        }
    };

    const statusInfo = getStatusInfo(item.status);

    return (
        <Card style={styles.card} onPress={onJobPress}>
            <Card.Content>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: Colors.primary }}>
                    Mã đơn: #{item.id}
                </Text>
                <View style={styles.row}>
                    <Text style={{ fontWeight: 'bold', flex: 1 }}>Trạng thái:</Text>
                    <Text style={{ fontWeight: 'bold', color: statusInfo.color }}>
                        {statusInfo.text}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={{ color: "#555" }}>Ngày nộp:</Text>
                    <Text style={{ color: "#555" }}>{moment(item.created_at).format("DD/MM/YYYY HH:mm")}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={{ color: "#555" }}>Ghi chú:</Text>
                    <Text style={{ color: "#555", flex: 1, textAlign: "right" }} numberOfLines={1}>
                        {item.cover_letter || "Không có"}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: { 
        marginBottom: 15, 
        backgroundColor: "white", 
        elevation: 2, 
        borderRadius: 10 
    },
    row: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 8 
    }
});

export default ApplicationCard;