import { Fragment } from 'react'
import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import { RestDetailedProfileResponse } from '@/services/profile/schema'
import { Controller } from 'react-hook-form'
import AbstractForm from './AbstractProfilForm'
import { validateRSFormSchema } from './schema'

const socialPlatforms = [
  { id: 'facebook', placeholder: 'facebook.com/nom-utilisateur', label: 'Facebook', starturl: 'https://facebook.com/' },
  { id: 'telegram', placeholder: 't.me/nom-utilisateur', label: 'Telegram', starturl: 'https://t.me/' },
  { id: 'instagram', placeholder: 'instagram.com/nom-utilisateur', label: 'Instagram', starturl: 'https://instagram.com/' },
  { id: 'twitter', placeholder: 'twitter.com/nom-utilisateur', label: 'Twitter', starturl: 'https://x.com/' },
  { id: 'linkedin', placeholder: 'linkedin.com/nom-utilisateur', label: 'Linkedin', starturl: 'https://linkedin.com/in/' },
] as const

export const RSForm = ({ profile }: { profile: RestDetailedProfileResponse }) => {
  return (
    <AbstractForm
      uuid={profile.uuid}
      defaultValues={
        {
          facebook_page_url: profile.facebook_page_url,
          telegram_page_url: profile.telegram_page_url,
          instagram_page_url: profile.instagram_page_url,
          twitter_page_url: profile.twitter_page_url,
          linkedin_page_url: profile.linkedin_page_url,
        } as const
      }
      validatorSchema={validateRSFormSchema}
    >
      {({ control }) => (
        <Fragment>
          <Text.LG semibold>Réseaux sociaux</Text.LG>

          {socialPlatforms.map((platform) => (
            <Controller
              key={platform.id}
              name={`${platform.id}_page_url`}
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <Input
                  color="gray"
                  placeholder={platform.label}
                  value={value ? value : platform.starturl}
                  onBlur={onBlur}
                  error={error?.message}
                  onChange={onChange}
                />
              )}
            />
          ))}
        </Fragment>
      )}
    </AbstractForm>
  )
}

export default RSForm
