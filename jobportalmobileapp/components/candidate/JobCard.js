import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card, Text, IconButton, Avatar } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/vi';
import Colors from '../../theme/Color';
import { JobCardStyles } from './Styles';

const JobCard = ({ item, next, onToggleSave }) => {
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
        if (item.is_negotiable) {
            return "Thỏa thuận";
        }
        if (item.salary_min && item.salary_max) {
            return `Lương từ ${formatSalary(item.salary_min)} - ${formatSalary(item.salary_max)}`;
        } else if (item.salary_min) {
            return `Lương từ ${formatSalary(item.salary_min)}`;
        }
        return "Chưa cập nhật";
    };

    return (
        <TouchableOpacity onPress={next} activeOpacity={0.8}>
            <Card style={JobCardStyles.card}>
                <Card.Title
                    title={item.name}
                    titleStyle={{ fontWeight: 'bold', color: Colors.primary, fontSize: 16 }}
                    subtitle={item.company_name || "Công ty ẩn danh"}
                    
                    // Hiển thị Avatar công ty bên trái
                    left={(props) => (
                        <Avatar.Image 
                            {...props} 
                            size={45} 
                            // Nếu không có avatar thì dùng ảnh mặc định chống lỗi mờ
                            source={{ uri: item.company_avatar || "https://res.cloudinary.com/thanhai/image/upload/v1772629826/cld-sample-2.jpg" }} 
                            style={{ backgroundColor: '#f0f0f0' }}
                        />
                    )}
                    
                    // Hiển thị nút Thả tim bên phải
                    right={(props) => (
                        <IconButton 
                            {...props} 
                            icon={item.is_saved ? "heart" : "heart-outline"} 
                            iconColor={item.is_saved ? "#d32f2f" : Colors.primary}
                            size={24}
                            onPress={onToggleSave} 
                        />
                    )}
                />
                
                <Card.Content style={{ paddingLeft: 70 }}> 
                    <Text variant="bodyMedium" style={JobCardStyles.salary}>
                        {getSalaryText()}
                    </Text>
                    
                    <View style={JobCardStyles.row}>
                        <Text variant="bodySmall" style={JobCardStyles.location}>
                            📍 {item.location || "Chưa cập nhật"}
                        </Text>
                        <Text variant="bodySmall" style={JobCardStyles.date}>
                             {moment(item.updated_at).fromNow()}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

export default JobCard;