import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/vi';
import Colors from '../../theme/Color';
import GlobalStyles from '../../style/Styles'; 
import ComponentStyles from './Styles';

const ApplicationCard = ({ item, onJobPress }) => {
    const formatSalary = (salary) => {
        if (!salary) return "";
        const millions = salary / 1000000;
        return millions % 1 === 0 ? `${millions}tr` : `${millions.toFixed(1)}tr`;
    };

    const getSalaryText = () => {
        if (!item) return "Chưa cập nhật";
        if (item.is_negotiable) return "Thỏa thuận";
        if (item.salary_min && item.salary_max) return `Lương ${formatSalary(item.salary_min)} - ${formatSalary(item.salary_max)}`;
        return "Chưa cập nhật";
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING': return { text: "Chờ duyệt", color: Colors.status.pending };
            case 'REVIEWING': return { text: "Đang xem xét", color: Colors.status.reviewing };
            case 'ACCEPTED': return { text: "Chấp nhận", color: Colors.status.accepted };
            case 'REJECTED': return { text: "Từ chối", color: Colors.status.rejected };
            default: return { text: "Không rõ", color: Colors.text.tertiary };
        }
    };

    const statusInfo = getStatusInfo(item.status);
    const jobName = item.job_name || "Công việc ẩn danh";
    const companyName = item.company_name || "Công ty ẩn danh";

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onJobPress}>
            <Card style={ComponentStyles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={ComponentStyles.jobTitle}>
                        {jobName}
                    </Text>
                    <Text style={ComponentStyles.companyName}>
                        {companyName}
                    </Text>
                    <Text style={ComponentStyles.salary}>
                        {getSalaryText()}
                    </Text>

                    <View style={ComponentStyles.rowBetween}>
                        <Text style={ComponentStyles.label}>Trạng thái:</Text>
                        <Text style={[ComponentStyles.statusValue, { color: statusInfo.color }]}>
                            {statusInfo.text}
                        </Text>
                    </View>
                    <View style={ComponentStyles.rowBetween}>
                        <Text style={ComponentStyles.value}>Ngày nộp:</Text>
                        <Text style={ComponentStyles.value}>{moment(item.created_at).format("DD/MM/YYYY HH:mm")}</Text>
                    </View>
                    <View style={ComponentStyles.rowBetween}>
                        <Text style={ComponentStyles.value}>Ghi chú:</Text>
                        <Text style={ComponentStyles.noteValue} numberOfLines={1}>
                            {item.cover_letter || "Không có"}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

export default ApplicationCard;