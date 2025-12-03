import { Redirect } from "expo-router";
import { useSession } from "@/ctx/SessionProvider";
import PublicationPageIndex from "@/features/publications/pages/index";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import { AccessDeny } from "@/components/AccessDeny";

export default function Publications() {
  const { isAuth } = useSession()
  const { hasFeature } = useGetExecutiveScopes()

  if (!isAuth) {
    return <Redirect href={'/(app)/(tabs)/evenements/'} />
  }
  
  if (!hasFeature('publications')) {
    return <AccessDeny />
  }

  return <PublicationPageIndex />;
}
