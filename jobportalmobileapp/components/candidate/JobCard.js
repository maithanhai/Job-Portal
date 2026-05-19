import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Avatar } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/vi';
import Colors from '../../theme/Color';

const JobCard = ({ item, next, onToggleSave }) => {
    return (
        <TouchableOpacity onPress={next} activeOpacity={0.8}>
            <Card style={localStyles.card}>
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
                    <Text variant="bodyMedium" style={localStyles.salary}>
                        Lương: {item.is_negotiable ? "Thỏa thuận" : `${item.salary_min?.toLocaleString('vi-VN')} VNĐ`}
                    </Text>
                    
                    <View style={localStyles.row}>
                        <Text variant="bodySmall" style={localStyles.location}>
                            📍 {item.location || "Chưa cập nhật"}
                        </Text>
                        <Text variant="bodySmall" style={localStyles.date}>
                            ⏳ {moment(item.updated_at).fromNow()}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const localStyles = StyleSheet.create({
    card: { 
        marginBottom: 15, 
        backgroundColor: "white", 
        elevation: 2,
        borderRadius: 10 
    },
    salary: { 
        color: "#d32f2f", 
        fontWeight: "bold", 
        marginBottom: 8 
    },
    row: { 
        flexDirection: "row", 
        justifyContent: "space-between",
        alignItems: "center" 
    },
    location: { 
        color: "#555",
        flex: 1, // Để chữ quá dài không bị đẩy icon thời gian
        marginRight: 10 
    },
    date: { 
        color: "#888", 
        fontStyle: 'italic' 
    }
});

export default JobCard;