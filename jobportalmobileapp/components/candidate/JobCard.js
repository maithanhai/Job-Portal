import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card, Text, IconButton, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/vi';
import Colors from '../../theme/Color';
import GlobalStyles from '../../style/Styles';
import ComponentStyles from './Styles';

const JobCard = ({ item, next, onToggleSave, onToggleCompare }) => {
    const formatSalary = (salary) => {
        if (!salary) return "";
        if (salary >= 1000000) return `${parseFloat((salary / 1000000).toFixed(1))}tr`;
        return `${parseFloat((salary / 1000).toFixed(1))}k`;
    };

    const getSalaryText = () => {
        if (item.is_negotiable) return "Thỏa thuận";
        if (item.salary_min && item.salary_max) return `${formatSalary(item.salary_min)} - ${formatSalary(item.salary_max)}`;
        return item.salary_min ? `Từ ${formatSalary(item.salary_min)}` : "Chưa cập nhật";
    };

    return (
        <TouchableOpacity onPress={next} activeOpacity={0.8}>
            <Card style={ComponentStyles.jobCardContainer}>
                <Card.Title
                    title={item.name}
                    titleStyle={ComponentStyles.jobCardTitle}
                    subtitle={item.company_name || item.employer?.company_name || "Công ty ẩn danh"}
                    left={(props) => (
                        <Avatar.Image 
                            {...props} 
                            size={48} 
                            source = {item.logo_company? {uri:item.logo_company}:require("../../assets/company-default.png")}
                        />
                    )}
                    right={(props) => (
                        <IconButton 
                            {...props} 
                            icon={item.is_saved ? "heart" : "heart-outline"} 
                            iconColor={item.is_saved ? Colors.heart.active : Colors.heart.inactive}
                            onPress={onToggleSave} 
                        />
                    )}
                />
                
                <Card.Content style={{ paddingLeft: 72 }}> 
                    <View style={GlobalStyles.row}>
                        <MaterialCommunityIcons name="cash" size={18} color={Colors.salary.primary} />
                        <Text style={ComponentStyles.jobCardSalary}>{getSalaryText()}</Text>
                    </View>
                    
                    <View style={[GlobalStyles.row, {marginTop: 4, marginBottom: 8}]}>
                        <MaterialCommunityIcons name="map-marker" size={16} color={Colors.text.secondary} />
                        <Text style={ComponentStyles.jobCardLocation} numberOfLines={1}>{item.location || "Chưa cập nhật"}</Text>
                    </View>

                </Card.Content>

                <Divider style={ComponentStyles.jobCardDivider} />

                <View style={ComponentStyles.jobCardFooter}>
                    <View style={GlobalStyles.row}>
                        <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.text.tertiary} />
                        <Text style={ComponentStyles.jobCardTime}>{moment(item.updated_at).fromNow()}</Text>
                    </View>

                    {onToggleCompare && (
                        <TouchableOpacity onPress={onToggleCompare} style={ComponentStyles.jobCardCompareBtn}>
                            <MaterialCommunityIcons 
                                name={item.isCompared ? "check-circle" : "plus-circle-outline"} 
                                size={20} 
                                color={item.isCompared ? Colors.primary : Colors.text.secondary} 
                            />
                            <Text style={[ComponentStyles.jobCardCompareText, item.isCompared ? {color: Colors.primary} : null]}>
                                {item.isCompared ? "Đã chọn" : "So sánh"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Card>
        </TouchableOpacity>
    );
};

export default JobCard;