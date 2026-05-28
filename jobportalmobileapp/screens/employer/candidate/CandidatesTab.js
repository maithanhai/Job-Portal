import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { authApis, endpoints } from "../../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CandidateCard from "../../../components/employer/CandidateCard";
import ScreenStyles from "./Styles";
import Header from "../../../components/common/Header";
import VerifyWrapper from "../../../components/employer/VerifyWrapper";
import { MyUserContext } from "../../../configs/Contexts"; 
import Colors from "../../../theme/Color";

const CandidatesTab = () => {
  const [user] = useContext(MyUserContext); 
  const [jobsFilter, setJobsFilter] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const nav = useNavigation();

  const isVerifiedEmployer = user?.role === 'EMPLOYER' && user?.is_verified === true;

  const loadData = async (jobId = selectedJobId) => {
    if (!isVerifiedEmployer) return;

    setLoading(true);
    try {
      let token = await AsyncStorage.getItem("token");
      let url = `${endpoints["applications"]}${jobId ? `?job_id=${jobId}` : ""}`;
      let res = await authApis(token).get(url);
      setApplications(res.data.results || []);
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterJobs = async () => {
    if (!isVerifiedEmployer) return;
    
    try {
      let token = await AsyncStorage.getItem("token");
      let res = await authApis(token).get(endpoints["my-jobs"]);
      setJobsFilter(res.data.results || []);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadFilterJobs();
      loadData();
    }
  }, [isFocused]);
  return (
    <SafeAreaView style={ScreenStyles.safeArea} edges={["top"]}>
      <VerifyWrapper>
        <View style={ScreenStyles.filterContainer}>
          <Header
            data={jobsFilter}
            selectedId={selectedJobId}
            onSelect={(id) => {
              setSelectedJobId(id);
              loadData(id);
            }}
            defaultLabel="Tất cả tin đăng"
          />
        </View>

        {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        ) : (
            <FlatList
              data={applications}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <CandidateCard
                  item={item}
                  onUpdateStatus={() => nav.navigate("CandidateDetail", { applicationId: item.id })}
                />
              )}
              contentContainerStyle={applications.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
              ListEmptyComponent={
                <View style={[ScreenStyles.emptyBox, { flex: 1, justifyContent: 'center' }]}>
                  <Text style={ScreenStyles.emptyText}>Chưa có hồ sơ ứng tuyển.</Text>
                </View>
              }
            />
        )}
      </VerifyWrapper>
    </SafeAreaView>
  );
};

export default CandidatesTab;