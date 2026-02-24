import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" />
//     </Stack>
//   );
// }


export default function Layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}