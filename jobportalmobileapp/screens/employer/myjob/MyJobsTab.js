import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, Text } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { authApis, endpoints } from "../../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../../theme/Color";
import JobCard from "../../../components/employer/JobCard";
import ScreenStyles from "./Styles";
import VerifyWrapper from "../../../components/employer/VerifyWrapper";
import LocalStyles from "./Styles";

const MyJobsTab = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [activeTab, setActiveTab] = useState('active'); 

  const isFocused = useIsFocused();
  const nav = useNavigation();

  const loadMyJobs = async (targetPage, isLoadMore = false, currentTab = activeTab) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      let token = await AsyncStorage.getItem("token");

      let url = `${endpoints["my-jobs"]}?page=${targetPage}&status=${currentTab}`;
      let res = await authApis(token).get(url);

      setHasNextPage(res.data.next !== null);
      if (targetPage === 1) setJobs(res.data.results);
      else setJobs((prev) => [...prev, ...res.data.results]);
    } catch (ex) {
      if (ex.response?.status === 404) setHasNextPage(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasNextPage(true);
    await loadMyJobs(1, false, activeTab);
    setRefreshing(false);
  };

  useEffect(() => {
    if (isFocused) {
      setPage(1);
      setHasNextPage(true);
      loadMyJobs(1, false, activeTab);
    }
  }, [isFocused]);

  useEffect(() => {
    if (page > 1) loadMyJobs(page, true, activeTab);
  }, [page]);

  const handleTabChange = (tabName) => {
    if (activeTab === tabName) return;
    setActiveTab(tabName);
    setPage(1);
    setHasNextPage(true);
    setJobs([]); 
    loadMyJobs(1, false, tabName); 
  };

  const loadMore = () => {
    if (hasNextPage && !loading && !loadingMore) setPage((prev) => prev + 1);
  };

  const handleDeleteJob = (jobId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa tin tuyển dụng này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              let token = await AsyncStorage.getItem("token");
              let res = await authApis(token).delete(endpoints["job-details"](jobId));
              if (res.status === 204 || res.status === 200) {
                Alert.alert("Thành công", "Đã gỡ tin tuyển dụng.");
                setJobs((prev) => prev.filter((item) => item.id !== jobId));
              }
            } catch (ex) {
              Alert.alert("Lỗi", "Không thể xóa bài đăng lúc này.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={ScreenStyles.safeArea} edges={["top"]}>
      <VerifyWrapper>
        <View style={LocalStyles.tabContainer}>
          <TouchableOpacity 
            style={[LocalStyles.tabButton, activeTab === 'active' && LocalStyles.tabActive]} 
            onPress={() => handleTabChange('active')}
          >
            <Text style={[LocalStyles.tabText, activeTab === 'active' && LocalStyles.tabTextActive]}>
              Đang Tuyển
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[LocalStyles.tabButton, activeTab === 'expired' && LocalStyles.tabActive]} 
            onPress={() => handleTabChange('expired')}
          >
            <Text style={[LocalStyles.tabText, activeTab === 'expired' && LocalStyles.tabTextActive]}>
              Đã Đóng
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            (loading || loadingMore) && (
              <ActivityIndicator color={Colors.primary} style={{ margin: 10 }} />
            )
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          ListEmptyComponent={
            !loading && (
              <View style={ScreenStyles.emptyBox}>
                <Text style={ScreenStyles.emptyText}>
                   {activeTab === 'active' 
                      ? "Bạn chưa có tin tuyển dụng nào đang mở." 
                      : "Bạn không có tin tuyển dụng quá hạn."}
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <JobCard
              item={item}
              onDelete={() => handleDeleteJob(item.id)}
              onEdit={() => nav.navigate("JobForm", { jobData: item })}
            />
          )}
        />

        <FAB
          icon="plus"
          style={ScreenStyles.fab}
          color={Colors.white}
          onPress={() => nav.navigate("JobForm", { jobData: null })}
        />
      </VerifyWrapper>
    </SafeAreaView>
  );
};

export default MyJobsTab;