import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';
import Apis, { endpoints } from '../../../configs/Apis';
import Colors from '../../../theme/Color';
import ScreenStyles from './Styles';
import InfoItem from '../../../components/employer/InfoItem';

const CompareJobs = ({ route, navigation }) => {
    const initialJobs = route.params?.jobsToCompare || [];
    const [jobs, setJobs] = useState(initialJobs);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();

    useLayoutEffect(() => {
        navigation.setOptions({ title: "So sánh công việc" });
    }, [navigation]);

    useEffect(() => {
        const loadFullData = async () => {
            try {
                const fullList = await Promise.all(initialJobs.map(async (job) => {
                    if (job.requirements && job.benefits) return job;
                    try {
                        const res = await Apis.get(endpoints['job-details'](job.id));
                        return res.data;
                    } catch (e) { return job; }
                }));
                setJobs(fullList);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        loadFullData();
    }, []);

    const formatSalary = (job) => {
        if (job.is_negotiable) return "Thỏa thuận";
        const format = (val) => {
            if (val >= 1000000) return `${(val / 1000000)}tr`;
            if (val >= 1000) return `${(val / 1000)}k`;
            return val.toLocaleString();
        };
        return job.salary_min ? `${format(job.salary_min)} ${job.salary_max ? '- ' + format(job.salary_max) : ''}` : "Chưa cập nhật";
    };

    if (loading) return <View style={ScreenStyles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;

    const htmlStyles = {
        p: { fontSize: 14, color: Colors.text.primary, marginBottom: 4, lineHeight: 20 },
        li: { fontSize: 14, color: Colors.text.primary, marginBottom: 4 },
        ul: { paddingLeft: 10, margin: 0 }
    };
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ScreenStyles.scrollCompare}>
            {jobs.map((job, index) => (
                <Surface key={index} style={[ScreenStyles.cardCompare, { width: width * 0.85 }]}>
                    <Text style={ScreenStyles.jobTitle}>{job.name}</Text>
                    <Text style={ScreenStyles.company}>{job.employer.company_name || "Công ty ẩn danh"}</Text>
                    
                    <Divider style={{ marginVertical: 15 }} />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <InfoItem icon="cash" label="Mức lương" value={formatSalary(job)} isHighlight />
                        <InfoItem icon="map-marker" label="Địa điểm" value={job.location || "Chưa cập nhật"} />
                        <View style={ScreenStyles.section}>
                            <Text style={ScreenStyles.sectionLabel}>Thông tin việc làm</Text>
                            <RenderHTML 
                                contentWidth={width * 0.75} 
                                source={{ html: job.description || "<p>Chưa có thông tin</p>" }} 
                                tagsStyles={htmlStyles}
                            />
                        </View>
                        <View style={ScreenStyles.section}>
                            <Text style={ScreenStyles.sectionLabel}>Yêu cầu công việc</Text>
                            <RenderHTML 
                                contentWidth={width * 0.75} 
                                source={{ html: job.requirements || "<p>Chưa có thông tin</p>" }} 
                                tagsStyles={htmlStyles}
                            />
                        </View>

                        <View style={ScreenStyles.section}>
                            <Text style={ScreenStyles.sectionLabel}>Quyền lợi</Text>
                            <RenderHTML 
                                contentWidth={width * 0.75} 
                                source={{ html: job.benefits || "<p>Chưa có thông tin</p>" }} 
                                tagsStyles={htmlStyles}
                            />
                        </View>
                    </ScrollView>
                </Surface>
            ))}
        </ScrollView>
    );
};


export default CompareJobs;