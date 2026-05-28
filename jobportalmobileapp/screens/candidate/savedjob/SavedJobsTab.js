import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { authApis, endpoints } from "../../../configs/Apis";
import Colors from "../../../theme/Color";
import JobCard from "../../../components/candidate/JobCard";
import ScreenStyles from "./Styles";

const SavedJobsTab = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [nextUrl, setNextUrl] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const nav = useNavigation();
    const isFocused = useIsFocused();

    const loadSavedJobs = async (currentPage, isLoadMore = false) => {
        try {
            let token = await AsyncStorage.getItem("token");
            if (!token) return;

            const url = `${endpoints['saved-jobs']}${endpoints['saved-jobs'].includes('?') ? '&' : '?'}page=${currentPage}`;
            let res = await authApis(token).get(url);
            
            const hasPagination = res.data.results !== undefined;
            const newData = hasPagination ? res.data.results : res.data;
            
            setNextUrl(hasPagination ? res.data.next : null);
            setSavedJobs(prev => isLoadMore ? [...prev, ...newData] : newData);
        } catch (ex) {} finally { setLoading(false); setRefreshing(false); setLoadingMore(false); }
    };

    useEffect(() => { 
        if (isFocused) { setPage(1); loadSavedJobs(1, false); } 
    }, [isFocused]);

    const handleUnsave = async (jobId) => {
        try {
            let token = await AsyncStorage.getItem("token");
            await authApis(token).delete(endpoints['saved-job-delete'](jobId));
            setSavedJobs(prev => prev.filter(item => item.job !== jobId));

            try {
                const unsavedStr = await AsyncStorage.getItem('unsaved_jobs');
                const unsavedIds = unsavedStr ? JSON.parse(unsavedStr) : [];
                unsavedIds.push(jobId);
                await AsyncStorage.setItem('unsaved_jobs', JSON.stringify(unsavedIds));
            } catch (e) {}
            Alert.alert("Thành công", "Đã bỏ lưu công việc.");
        } catch (ex) { 
            Alert.alert("Lỗi", "Không thể bỏ lưu lúc này."); 
        }
    };

    return (
        <SafeAreaView style={ScreenStyles.safeArea}>
            {loading && page === 1 ? (
                <View style={ScreenStyles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>
            ) : (
                <FlatList
                    contentContainerStyle={ScreenStyles.listContent}
                    data={savedJobs}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setPage(1); loadSavedJobs(1, false); }} colors={[Colors.primary]} />}
                    onEndReached={() => {
                        if (nextUrl && !loadingMore && !loading) {
                            setLoadingMore(true); setPage(prev => prev + 1); loadSavedJobs(page + 1, true);
                        }
                    }}
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={Colors.primary} style={{margin: 20}} /> : null}
                    ListEmptyComponent={
                        <View style={ScreenStyles.emptyBox}>
                            <Text style={ScreenStyles.emptyText}>Bạn chưa lưu công việc nào.</Text>
                            <Text style={ScreenStyles.emptySub}>Bấm thả tim ở trang chủ để lưu công việc vào đây</Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const jobDataWithSavedStatus = {
                            ...item.job_details,
                            is_saved: true 
                        };

                        return (
                            <JobCard
                                item={jobDataWithSavedStatus}
                                next={() => nav.navigate('JobDetail', { jobId: item.job })}
                                onToggleSave={() => handleUnsave(item.job)}
                            />
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
};

export default SavedJobsTab;