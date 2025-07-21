import { Redirect } from "expo-router";
import { useSession } from "@/ctx/SessionProvider";
import PublicationPageIndex from "@/features/publications/pages/index";

export default function Publications() {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/(app)/(tabs)/evenements/'} />
  }
  
  return <PublicationPageIndex />;
}
