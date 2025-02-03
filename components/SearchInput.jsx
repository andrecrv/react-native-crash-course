import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { router, usePathname } from 'expo-router';

import { icons } from '@/constants';

const SearchInput = ({ initialQuery, placeholder, handleQuery }) => {
    const [isFocused, setIsFocused] = useState(false);
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '');

    return (
        <View className={`border-2 ${isFocused ? 'border-secondary' : 'border-black-200'} border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4`}>
            {/* className -> focus:* works only in IOS */}
            <TextInput
                className="text-base mt-2 text-white flex-1 font-pregular"
                value={query}
                placeholder={placeholder}
                placeholderTextColor="#CDCDE0"
                onChangeText={(e) => setQuery(e)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            <TouchableOpacity
                onPress={() => {
                    if (!query) {
                        return Alert.alert("Missing query", "Please input something to search results across database")
                    }

                    if (pathname.startsWith('/search')) router.setParams({ query })
                    else if (pathname.startsWith('/bookmark')) handleQuery(query)
                    else router.push(`/search/${query}`)
                }}
            >
                <Image
                    source={icons.search}
                    className="w-5 h-5"
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    )
}

export default SearchInput