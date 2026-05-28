import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar, Text, IconButton, Badge } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { MyUserContext } from "../../../configs/Contexts";
import Colors from "../../../theme/Color";
import JobCard from "../../../components/candidate/JobCard";
import ScreenStyles from "./Styles";
import Header from "../../../components/common/Header";
import FilterModal from "../../../components/common/FilterModal"; 
import CompareBar from "../../../components/common/CompareBar";   

const HomeCandidateTab = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [loadingMore, setLoadingMore] = useState(false); 
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]); 

  const [user] = useContext(MyUserContext);
  const nav = useNavigation();

  const [q, setQ] = useState("");
  const [cateId, setCateId] = useState(null);
  
  const [filters, setFilters] = useState({ 
      location: "", 
      companyName: "", 
      salary_min: "", 
      salary_max: "" 
  });
  
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [compareList, setCompareList] = useState([]);

  const hasActiveFilters = Boolean(
      filters.location?.trim() || 
      filters.companyName?.trim() || 
      (filters.salary_min !== "" && filters.salary_min !== undefined)
  );

  useEffect(() => {
    const loadCategories = async () => {
        try {
            let res = await Apis.get(endpoints['categories']);
            setCategories(res.data);
        } catch (ex) { console.error(ex); }
    }
    loadCategories();
  }, []);

  const loadJobs = async (pageNumber, searchQuery = q, category = cateId, advancedFilters = filters) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      let token = await AsyncStorage.getItem("token");
      
      let url = `${endpoints["jobs"]}?page=${pageNumber}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      if (category) url += `&category_id=${category}`;
      if (advancedFilters.location) url += `&location=${encodeURIComponent(advancedFilters.location)}`;
      
      if (advancedFilters.salary_min !== undefined && advancedFilters.salary_min !== "") {
          url += `&salary_min=${advancedFilters.salary_min}`;
      }
      if (advancedFilters.salary_max !== undefined && advancedFilters.salary_max !== "") {
          url += `&salary_max=${advancedFilters.salary_max}`;
      }
      
      if (advancedFilters.companyName) url += `&company_name=${encodeURIComponent(advancedFilters.companyName)}`;

      let res = token ? await authApis(token).get(url) : await Apis.get(url);

      if (pageNumber === 1) {
          setJobs(res.data.results);
      } else {
          setJobs((prev) => {
              const existingIds = new Set(prev.map(job => job.id));
              const newJobs = res.data.results.filter(job => !existingIds.has(job.id));
              return [...prev, ...newJobs];
          });
      }

      if (res.data.next === null) setPage(0); 
      else setPage(pageNumber); 

    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false); setLoadingMore(false); setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { loadJobs(1, q, cateId, filters); }, 500);
    return () => clearTimeout(timer);
  }, [q, cateId, filters]);

  useFocusEffect(
    useCallback(() => {
      const syncHearts = async () => {
        try {
          const unsavedStr = await AsyncStorage.getItem('unsaved_jobs');
          if (unsavedStr) {
            const unsavedIds = JSON.parse(unsavedStr);
            if (unsavedIds.length > 0) {
              setJobs(prevJobs => prevJobs.map(job => 
                unsavedIds.includes(job.id) ? { ...job, is_saved: false } : job
              ));
              await AsyncStorage.removeItem('unsaved_jobs');
            }
          }
        } catch (e) {}
      };
      syncHearts();
    }, []) 
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs(1, q, cateId, filters);
  };

  const handleToggleSave = async (jobId, isSavedCurrent) => {
    let token = await AsyncStorage.getItem("token");
    if (!token || !user || user.role !== "CANDIDATE") return Alert.alert("Thông báo", "Vui lòng đăng nhập!");

    setJobs((prev) => prev.map((job) => job.id === jobId ? { ...job, is_saved: !isSavedCurrent } : job));

    try {
      if (isSavedCurrent) {
        await authApis(token).delete(endpoints["saved-job-delete"](jobId));
        Alert.alert("Thành công", "Đã bỏ lưu công việc.");
      } else {
        await authApis(token).post(endpoints["saved-jobs"], { job: jobId });
        Alert.alert("Thành công", "Đã lưu công việc.");
      }
    } catch (ex) {
      setJobs((prev) => prev.map((job) => job.id === jobId ? { ...job, is_saved: isSavedCurrent } : job));
      Alert.alert("Lỗi", "Thao tác thất bại.");
    }
  };

  const handleToggleCompare = (job) => {
      if (compareList.find(j => j.id === job.id)) {
          setCompareList(prev => prev.filter(j => j.id !== job.id)); 
      } else if (compareList.length >= 3) {
          Alert.alert("Giới hạn", "Chỉ có thể so sánh tối đa 3 công việc cùng lúc.");
      } else {
          setCompareList(prev => [...prev, job]); 
      }
  };

  return (
    <SafeAreaView style={ScreenStyles.safeArea} edges={["top"]}>
      <View style={ScreenStyles.headerBox}>
        <Header data={categories} selectedId={cateId} onSelect={setCateId} defaultLabel="Tất cả ngành nghề" />
        
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 10 }}>
            <Searchbar
                value={q}
                onChangeText={(text) => setQ(text)} 
                placeholder="Tìm việc..."
                style={{ flex: 1, backgroundColor: Colors.bg.lightest, elevation: 0, borderWidth: 1, borderColor: Colors.bg.light }}
                inputStyle={{ fontSize: 14 }}
            />
            
            <View style={{ position: 'relative' }}>
                <IconButton 
                    icon="tune-variant" 
                    iconColor={hasActiveFilters ? "white" : Colors.primary} 
                    containerColor={hasActiveFilters ? Colors.primary : Colors.bg.lightest}
                    size={26} 
                    style={{ 
                        margin: 0, 
                        marginLeft: 10, 
                        borderWidth: 1, 
                        borderColor: hasActiveFilters ? Colors.primary : Colors.bg.light, 
                        borderRadius: 12 
                    }}
                    onPress={() => setFilterModalVisible(true)} 
                />
                
                {hasActiveFilters && (
                    <Badge 
                        size={12} 
                        style={{ 
                            position: 'absolute', 
                            top: -2, 
                            right: -2, 
                            backgroundColor: Colors.status.rejected 
                        }} 
                    />
                )}
            </View>
        </View>
      </View>

      <FilterModal 
          visible={filterModalVisible} 
          onClose={() => setFilterModalVisible(false)} 
          onApply={(newFilters) => setFilters(newFilters)} 
      />

      {loading && page === 1 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
      ) : (
          <FlatList
            contentContainerStyle={ScreenStyles.listPadding}
            data={jobs}
            keyExtractor={(item) => item.id.toString()}
            extraData={compareList} 
            onEndReached={() => {
              if (page > 0 && !loadingMore && jobs.length > 0) loadJobs(page + 1, q, cateId, filters);
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore && <ActivityIndicator style={{ margin: 20 }} color={Colors.primary} />}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
            ListEmptyComponent={
              !loading && !loadingMore && (
                <View style={ScreenStyles.emptyBox}>
                  <Text style={ScreenStyles.emptyText}>Không tìm thấy công việc.</Text>
                  <Text style={ScreenStyles.emptySubText}>Hãy thay đổi từ khóa hoặc xóa bớt bộ lọc</Text>
                </View>
              )
            }
            renderItem={({ item }) => (
              <JobCard
                item={{...item, isCompared: !!compareList.find(j => j.id === item.id)}} 
                next={() => nav.navigate("JobDetail", { jobId: item.id })}
                onToggleSave={() => handleToggleSave(item.id, item.is_saved)}
                onToggleCompare={() => handleToggleCompare(item)} 
              />
            )}
          />
      )}

      <CompareBar 
          compareList={compareList} 
          onClear={() => setCompareList([])} 
          onCompare={() => nav.navigate('CompareJobs', { jobsToCompare: compareList })} 
      />

    </SafeAreaView>
  );
};

export default HomeCandidateTab;