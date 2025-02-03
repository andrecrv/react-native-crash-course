import { View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import VideoCard from '@/components/VideoCard';

import { getSavedPosts } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';

const Bookmark = () => {
  const { data: posts, refetch } = useAppwrite(getSavedPosts);
  const [search, setSearch] = useState(false);
  const [searchedPosts, setSearchedPosts] = useState([]);

  useEffect(() => {
    refetch();
  }, [posts]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    //re call videos -> if any new videos appeared
    await refetch();
    setRefreshing(false);
  }

  const handleSearch = (query) => {
    const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()))
    setSearchedPosts(filteredPosts)
    setSearch(true)
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="my-6 px-4">
          <Text className="text-2xl font-psemibold text-white">
            Saved Videos
          </Text>

          <View className="mt-6 mb-8 gap-3">
            <SearchInput placeholder="Search your saved videos" handleQuery={handleSearch} />

            <View className="items-end">
              <TouchableOpacity className="px-4 py-1 rounded-md bg-gray-400" activeOpacity={0.7} onPress={() => setSearch(false)}>
                <Text className="text-center font-pmedium">Reset search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FlatList
          data={search ? searchedPosts : posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard videoId={item.$id} video={item} refresh={refetch} />
          )}
          // Moved above for keyboard issue (keyboard dismisses Input on its own)
          // ListHeaderComponent={() => (
          //   <View className="my-6 px-4">
          //     {/* <Text className="font-pmedium text-sm text-gray-100">
          //     Search Results
          //   </Text> */}

          //     <Text className="text-2xl font-psemibold text-white">
          //       {/* {query} */}Saved Videos
          //     </Text>

          //     <View className="mt-6 mb-8 gap-3">
          //       <SearchInput placeholder="Search your saved videos" handleQuery={handleSearch} />

          //       <View className="items-end">
          //         <TouchableOpacity className="px-4 py-1 rounded-md bg-gray-400" activeOpacity={0.7} onPress={() => setSearch(false)}>
          //           <Text className="text-center font-pmedium">Reset search</Text>
          //         </TouchableOpacity>
          //       </View>
          //     </View>
          //   </View>
          // )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos Found"
              subtitle="No saved videos found"
            />
          )}
          scrollEnabled={false}
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Bookmark;