import { Redirect } from "expo-router";
import { useSession } from "@/ctx/SessionProvider";
import PublicationDraftPage from "@/features/publications/pages/draft";
import { AccessDeny } from "@/components/AccessDeny";
import { useGetExecutiveScopes } from "@/services/profile/hook";

export default function PublicationsDraft() {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/(app)/(tabs)/evenements/'} />
  }

  const { hasFeature } = useGetExecutiveScopes()

  if (!hasFeature('publications')) {
    return <AccessDeny />
  }

  return <PublicationDraftPage />;
}