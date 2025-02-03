import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useVideoPlayer, VideoView } from 'expo-video';

import { icons } from '@/constants';
import { updatePost, getPost } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';

const VideoCard = ({ videoId, video: { title, thumbnail, video, creator: { username, avatar }, bookmark }, refresh }) => {
    const [play, setPlay] = useState(false);

    const handleBookmark = async () => {
        try {
            const newBookmark = bookmark === 'Yes' ? 'No' : 'Yes';
            await updatePost(videoId, newBookmark); // Wait for the update
            await refresh(); // Fetch updated data from Appwrite
        } catch (error) {
            console.error("Failed to update bookmark:", error);
        }
    };

    // Vimeo videos not supported by expo-video
    const player = useVideoPlayer({ uri: video },
        player => {
            player.play();
        });

    useEffect(() => {
        if (player.status === "idle" || player.status === "error") {
            //console.log("Video has an error loading or finished!");
            setPlay(false);
        }
    }, [player.status]);

    return (
        <View className="flex-col items-center px-4 mb-14">
            <View className="flex-row gap-3 items-start">
                <View className="justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                        <Image source={{ uri: avatar }}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover" />
                    </View>

                    <View className="justify-center flex-1 ml-3 gap-y-1">
                        <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
                            {title}
                        </Text>
                        <Text className="text-xs text-gray-100 font-pregular">
                            {username}
                        </Text>
                    </View>
                </View>

                <View className="pt-2 justify-center items-center">
                    <TouchableOpacity className="flex-1 p-2" onPress={handleBookmark}>
                        <Image source={icons.bookmark} tintColor={bookmark === 'Yes' ? '#FFA001' : '#CDCDE0'} className="w-5 h-5" resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View>

            {play ? (
                <View className="w-full h-60 rounded-xl mt-3">
                    <VideoView
                        player={player}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="contain" // 'contain' by default
                        nativeControls
                    />
                </View>
            ) : (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                    className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
                >
                    <Image
                        source={{ uri: thumbnail }}
                        className="w-full h-full rounded-xl mt-3"
                        resizeMode="cover"
                    />
                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default VideoCard;