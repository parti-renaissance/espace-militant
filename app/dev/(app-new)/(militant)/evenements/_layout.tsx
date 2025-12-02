import { Stack } from 'expo-router'

export default function EvenementsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'default',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Événements',
        }} 
      />
      <Stack.Screen 
        name="[id]/index" 
        options={{ 
          title: 'Détail de l\'événement',
        }} 
      />
      <Stack.Screen 
        name="[id]/modifier" 
        options={{ 
          title: 'Modifier l\'événement',
        }} 
      />
      <Stack.Screen 
        name="creer" 
        options={{ 
          title: 'Créer un événement',
        }} 
      />
    </Stack>
  )
}

