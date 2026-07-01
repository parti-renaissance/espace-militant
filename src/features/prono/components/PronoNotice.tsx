import Text from '@/components/base/Text'

type PronoNoticeProps = {
  children: string
}

export default function PronoNotice({ children }: PronoNoticeProps) {
  return (
    <Text.MD semibold textAlign="center" color="$purple600">
      {children}
    </Text.MD>
  )
}
