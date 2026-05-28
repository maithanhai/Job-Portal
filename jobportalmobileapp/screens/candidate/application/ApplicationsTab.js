import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { authApis, endpoints } from "../../../configs/Apis";
import Colors from "../../../theme/Color";
import ApplicationCard from "../../../components/candidate/ApplicationCard";
import ScreenStyles from "./Styles";

const ApplicationsTab = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [nextUrl, setNextUrl] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const isFocused = useIsFocused();
    const nav = useNavigation();

    const loadApplications = async (currentPage, isLoadMore = false) => {
        try {
            let token = await AsyncStorage.getItem("token");
            if (!token) return;

            const url = `${endpoints['applications']}${endpoints['applications'].includes('?') ? '&' : '?'}page=${currentPage}`;
            let res = await authApis(token).get(url);
            
            const hasPagination = res.data.results !== undefined;
            const newData = hasPagination ? res.data.results : res.data;
            
            setNextUrl(hasPagination ? res.data.next : null);
            setApplications(prev => isLoadMore ? [...prev, ...newData] : newData);
        } catch (ex) {
            console.log(ex.response?.data || ex.message);
            Alert.alert("Lỗi", "Không thể lấy lịch sử ứng tuyển.");
        } finally {
            setLoading(false); setRefreshing(false); setLoadingMore(false);
        }
    };

    useEffect(() => { if (isFocused) { setPage(1); loadApplications(1, false); } }, [isFocused]);

    const onRefresh = () => { setRefreshing(true); setPage(1); loadApplications(1, false); };

    const handleLoadMore = () => {
        if (nextUrl && !loadingMore && !loading) {
            setLoadingMore(true);
            setPage(prev => prev + 1);
            loadApplications(page + 1, true);
        }
    };

    return (
        <SafeAreaView style={ScreenStyles.safeArea}>
            {loading && page === 1 ? (
                <View style={ScreenStyles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>
            ) : (
                <FlatList
                    data={applications}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={ScreenStyles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={Colors.primary} style={ScreenStyles.footerLoader} /> : null}
                    ListEmptyComponent={
                        <View style={ScreenStyles.emptyBox}>
                            <Text style={ScreenStyles.emptyText}>Bạn chưa ứng tuyển công việc nào.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <ApplicationCard item={item} onJobPress={() =>nav.navigate('ApplicationDetail', { applicationId: item.id })} />
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default ApplicationsTab;