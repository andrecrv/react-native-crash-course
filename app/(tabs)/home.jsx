import { View, Text, Image, FlatList, RefreshControl, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '@/constants';
import SearchInput from '@/components/SearchInput';
import Trending from '@/components/Trending';
import EmptyState from '@/components/EmptyState';
import VideoCard from '@/components/VideoCard';

import { useGlobalContext } from '@/context/GlobalProvider';
import { getAllPosts, getLatestPosts } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';


const Home = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts, refetch: refetchLatest } = useAppwrite(getLatestPosts);

  // Infinite loop of re - renders
  useEffect(() => {
    refetch();
  }, [posts]);

  useEffect(() => {
    refetchLatest();
  }, [latestPosts]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    //re call videos -> if any new videos appeared
    await refetch();
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-6">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back,
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {user?.username}
              </Text>
            </View>

            <View className="mt-1.5">
              <Image
                source={images.logoSmall}
                className="w-9 h-10"
                resizeMode="contain"
              />
            </View>
          </View>

          <SearchInput placeholder="Search for a video topic" />

          <View className="w-full flex-1 pt-8 pb-8">
            <Text className="text-gray-100 text-lg font-pregular mb-3">
              Latest videos
            </Text>

            <Trending posts={latestPosts ?? []} />
          </View>
        </View>

        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard videoId={item.$id} video={item} refresh={refetch} />
          )}
          scrollEnabled={false}
          // ListHeaderComponent={() => (
          // <View className="my-6 px-4 space-y-6">
          //   <View className="justify-between items-start flex-row mb-6">
          //     <View>
          //       <Text className="font-pmedium text-sm text-gray-100">
          //         Welcome Back,
          //       </Text>
          //       <Text className="text-2xl font-psemibold text-white">
          //         {user?.username}
          //       </Text>
          //     </View>

          //     <View className="mt-1.5">
          //       <Image
          //         source={images.logoSmall}
          //         className="w-9 h-10"
          //         resizeMode="contain"
          //       />
          //     </View>
          //   </View>

          //   <SearchInput placeholder="Search for a video topic" />

          //   <View className="w-full flex-1 pt-8 pb-8">
          //     <Text className="text-gray-100 text-lg font-pregular mb-3">
          //       Latest videos
          //     </Text>

          //     <Trending posts={latestPosts ?? []} />
          //   </View>
          // </View>
          // )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos Found"
              subtitle="Be the first one to upload a video"
            />
          )}
          // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home;