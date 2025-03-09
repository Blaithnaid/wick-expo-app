// import { useState } from 'react';
import { Text, View } from "@/components/Themed";
import { Button } from "@/components/ui/button";
import {
  InstagramProfile,
} from "@/constants/Instagram";

export default function InstagramProfileViewer(profile: InstagramProfile) {
  return (
    <View className="flex justify-center items-center w-full h-full p-4">
      <View>
        <Text>Hello!</Text>
      </View>
      <Button className="bg-iguana-500 w-fit px-6 py-2"></Button>
    </View>
  );
}
