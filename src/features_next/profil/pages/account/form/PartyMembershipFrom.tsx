import { Fragment } from 'react'
import RadioGroup from '@/components/base/RadioGroup/RadioGroup'
import Text from '@/components/base/Text'
import { RestDetailedProfileResponse } from '@/services/profile/schema'
import { Controller } from 'react-hook-form'
import * as z from 'zod'
import AbstractProfilForm from './AbstractProfilForm'

const PartyMembershipForm = ({ profile }: { profile: RestDetailedProfileResponse }) => {
  return (
    <AbstractProfilForm
      cardProps={{
        inside: true,
        bg: '$textSurface',
      }}
      uuid={profile.uuid}
      defaultValues={
        {
          party_membership: profile.party_membership ?? 'exclusive',
        } as const
      }
      validatorSchema={z.object({
        party_membership: z.enum(['other', 'exclusive', 'agir', 'territoires_progres', 'modem']),
      })}
    >
      {({ control }) => (
        <Fragment>
          <Text.MD semibold multiline>
            Appartenance à un autre parti politique
          </Text.MD>
          <Controller
            name="party_membership"
            control={control}
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                value={value}
                onChange={onChange}
                options={
                  [
                    {
                      label: 'Je certifie sur l’honneur que je n’appartiens à aucun autre parti politique',
                      value: 'exclusive',
                    },
                    {
                      label:
                        'Je suis membre de « Territoires de Progrès » et je peux bénéficier à ce titre de la double adhésion prévue dans les dispositions transitoires des status de Renaissance',
                      value: 'territoires_progres',
                    },
                    {
                      label:
                        'Je suis membre de « Agir, la droite constructive » et je peux bénéficier à ce titre de la double adhésion prévue dans les dispositions transitoires des status de Renaissance',
                      value: 'agir',
                    },
                    {
                      label: "J'appartiens à un autre parti politique",
                      value: 'other',
                    },
                  ] as const
                }
              />
            )}
          />
        </Fragment>
      )}
    </AbstractProfilForm>
  )
}

export default PartyMembershipForm
