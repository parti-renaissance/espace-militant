import { Redirect } from "expo-router";
import { useSession } from "@/ctx/SessionProvider";
import PublicationDraftPage from "@/features/publications/pages/draft";

export default function PublicationsDraft() {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/(app)/(tabs)/evenements/'} />
  }

  return <PublicationDraftPage />;
}