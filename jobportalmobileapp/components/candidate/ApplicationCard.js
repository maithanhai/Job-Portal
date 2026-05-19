import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/vi';
import Colors from '../../theme/Color';
import { ApplicationCardStyles } from './Styles';

const ApplicationCard = ({ item, onJobPress }) => {
    // Hàm format lương: 1000000 → "1tr", 1500000 → "1.5tr"
    const formatSalary = (salary) => {
        if (!salary) return "";
        const millions = salary / 1000000;
        if (millions % 1 === 0) {
            return `${millions}tr`;
        } else {
            return `${millions.toFixed(1)}tr`;
        }
    };

    // Format hiển thị lương
    const getSalaryText = () => {
        if (!item.job_details) return "Chưa cập nhật";
        
        if (item.job_details.is_negotiable) {
            return "Thỏa thuận";
        }
        if (item.job_details.salary_min && item.job_details.salary_max) {
            return `Lương từ ${formatSalary(item.job_details.salary_min)} - ${formatSalary(item.job_details.salary_max)}`;
        } else if (item.job_details.salary_min) {
            return `Lương từ ${formatSalary(item.job_details.salary_min)}`;
        }
        return "Chưa cập nhật";
    };

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
    const jobName = item.job_details?.name || "Công việc ẩn danh";
    const companyName = item.job_details?.company_name || "Công ty ẩn danh";

    return (
        <Card style={ApplicationCardStyles.card} onPress={onJobPress}>
            <Card.Content>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: Colors.primary, marginBottom: 8 }}>
                    {jobName}
                </Text>
                <Text style={{ color: "#666", fontSize: 14, marginBottom: 10 }}>
                    {companyName}
                </Text>
                <Text style={{ color: "#d32f2f", fontWeight: "bold", marginBottom: 8 }}>
                    {getSalaryText()}
                </Text>

                <View style={ApplicationCardStyles.row}>
                    <Text style={{ fontWeight: 'bold', flex: 1 }}>Trạng thái:</Text>
                    <Text style={{ fontWeight: 'bold', color: statusInfo.color }}>
                        {statusInfo.text}
                    </Text>
                </View>
                <View style={ApplicationCardStyles.row}>
                    <Text style={{ color: "#555" }}>Ngày nộp:</Text>
                    <Text style={{ color: "#555" }}>{moment(item.created_at).format("DD/MM/YYYY HH:mm")}</Text>
                </View>
                <View style={ApplicationCardStyles.row}>
                    <Text style={{ color: "#555" }}>Ghi chú:</Text>
                    <Text style={{ color: "#555", flex: 1, textAlign: "right" }} numberOfLines={1}>
                        {item.cover_letter || "Không có"}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};

export default ApplicationCard;