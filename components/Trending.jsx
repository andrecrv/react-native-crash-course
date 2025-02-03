import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import * as Animatable from 'react-native-animatable';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
//import { Video, ResizeMode } from 'expo-av'; // deprecated

import { icons } from '@/constants';

const zoomIn = {
    0: {
        scale: 0.9,
    },
    1: {
        scale: 1.1,
    }
}

const zoomOut = {
    0: {
        scale: 1.1,
    },
    1: {
        scale: 0.9,
    }
}

const TrendingItem = ({ activeItem, item }) => {
    const [play, setPlay] = useState(false);

    // Vimeo videos not supported by expo-video
    const player = useVideoPlayer({ uri: item.video },
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
        <Animatable.View
            className="mr-5"
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500} // miliseconds
        >
            {play ? (
                <View className="w-52 h-72 rounded-[35px] mt-3 bg-white/10">
                    <VideoView
                        player={player}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="contain" // 'contain' by default
                        nativeControls
                    />
                </View>
            ) : (
                <TouchableOpacity className="relative justify-center items-center shadow-lg shadow-black/40  rounded-[35px]" activeOpacity={0.7} onPress={() => setPlay(true)}>
                    <ImageBackground
                        source={{
                            uri: item.thumbnail
                        }}
                        className="w-52 h-72 rounded-[35px] my-5 overflow-hidden"
                        resizeMode="cover"
                    />

                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </Animatable.View>
    )
}

const Trending = ({ posts }) => {
    const [activeItem, setActiveItem] = useState(posts[1]);

    const viewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key)
        }
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
                <TrendingItem activeItem={activeItem} item={item} />
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70
            }}
            contentOffset={{ x: 125 }}
            horizontal
        />
    )
}

export default Trending;