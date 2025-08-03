import { Stack } from 'expo-router/stack';
import React from "react";

export default function StoriesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'fullScreenModal' }}>
      <Stack.Screen name="camera" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="viewer" />
    </Stack>
  );
}