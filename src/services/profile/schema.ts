import { z } from 'zod'

// -----------------  RestProfil  -----------------

export type RestProfilRequest = z.infer<typeof RestProfilRequestSchema>
export const RestProfilRequestSchema = z.void()

export type RestProfilResponse = z.infer<typeof RestProfilResponseSchema>
export const TagTypesSchema = z.union([z.literal('sympathisant'), z.literal('adherent'), z.literal('elu')])
export type RestProfilResponseTagTypes = z.infer<typeof TagTypesSchema>

const RestProfilInstancesSchema = z
  .object({
    assembly: z
      .object({
        code: z.string(),
        name: z.string(),
      })
      .nullish(),
    circonscription: z
      .object({
        code: z.string(),
        name: z.string(),
      })
      .nullish(),
    committee: z
      .object({
        name: z.string(),
        uuid: z.string().uuid(),
        members_count: z.number(),
        assembly_committees_count: z.number(),
        can_change_committee: z.boolean(),
        message: z.string().nullable(),
      })
      .nullish(),
  })
  .nullable()

export const RestProfilResponseSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  uuid: z.string().uuid(),
  postal_code: z.string(),
  email_address: z.string().email(),
  cadre_access: z.boolean(),
  cadre_auth_path: z.string().nullish(),
  certified: z.boolean(),
  country: z.string(),
  image_url: z.string().url().nullish(),
  email_subscribed: z.boolean(),
  nickname: z.string().nullable(),
  use_nickname: z.boolean(),
  instances: RestProfilInstancesSchema,
  surveys: z
    .object({
      total: z.number(),
      last_month: z.number(),
    })
    .optional(),
  tags: z.array(
    z.object({
      label: z.string(),
      type: TagTypesSchema,
      code: z.string(),
    }),
  ),
})

// -----------------  RestDetailedProfile  -----------------

export type RestDetailedProfileRequest = z.infer<typeof RestDetailedProfileRequestSchema>
export const RestDetailedProfileRequestSchema = z.void()

export type RestDetailedProfileResponse = z.infer<typeof RestDetailedProfileResponseSchema>
export const RestDetailedProfileResponseSchema = z.object({
  uuid: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  gender: z.string(),
  custom_gender: z.string().nullish(),
  nationality: z.string().nullable(),
  birthdate: z.coerce.date().nullable(),
  last_membership_donation: z.coerce.date().nullable(),
  party_membership: z.enum(['other', 'exclusive', 'agir', 'territoires_progres', 'modem']).nullish(),
  other_party_membership: z.boolean(),
  post_address: z
    .object({
      address: z.string().nullable().optional(),
      postal_code: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      city_name: z.string().nullable().optional(),
      region: z.string().nullable().optional(),
      country: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  change_email_token: z
    .object({
      email: z.string(),
      uuid: z.string(),
      expired_at: z.coerce.date(),
    })
    .nullish(),
  email_address: z.string().email(),
  facebook_page_url: z.string().nullable().optional(),
  twitter_page_url: z.string().nullable().optional(),
  linkedin_page_url: z.string().nullable().optional(),
  telegram_page_url: z.string().nullable().optional(),
  instagram_page_url: z.string().nullable().optional(),
  certified: z.boolean(),
  phone: z
    .object({
      country: z.string(),
      number: z.string(),
    })
    .nullable(),
  interests: z.array(
    z.object({
      code: z.string(),
      label: z.string(),
    }),
  ),
  subscription_types: z.array(
    z.object({
      code: z.string(),
      label: z.string(),
    }),
  ),
  main_zone: z
    .object({
      name: z.string(),
    })
    .nullish(),
})

// -----------------  RestUserScopes  -----------------

export type RestUserScopesRequest = z.infer<typeof RestUserScopesRequestSchema>
export const RestUserScopesRequestSchema = z.void()

export type RestUserScopesResponse = z.infer<typeof RestUserScopesResponseSchema>
export const RestUserScopesResponseSchema = z.array(
  z.object({
    code: z.string(),
    name: z.string(),
    zones: z.array(
      z.object({
        code: z.string(),
        name: z.string(),
        uuid: z.string().uuid(),
      }),
    ),
    apps: z.array(z.string()),
    features: z.array(z.string()),
  }),
)

// -----------------  RestUpdateProfile  -----------------

export type RestUpdateProfileRequest = z.infer<typeof RestUpdateProfileRequestSchema>
export const RestUpdateProfileRequestSchema = z
  .object({
    first_name: z.string(),
    last_name: z.string(),
    gender: z.string(),
    custom_gender: z.string(),
    nationality: z.string(),
    birthdate: z.coerce.date(),
    party_membership: z.enum(['other', 'exclusive', 'agir', 'territoires_progres', 'modem']).nullish(),
    post_address: z
      .object({
        address: z.string().nullable().optional(),
        postal_code: z.string().nullable().optional(),
        city_name: z.string().nullable().optional(),
        country: z.string().nullable().optional(),
      })
      .optional()
      .nullable(),
    // phone: z
    //   .object({
    //     country: z.string(),
    //     number: z.string().,
    //   })
    //   .nullable(),
    email_address: z.string().email(),
    facebook_page_url: z.string().url().nullable().optional(),
    twitter_page_url: z.string().url().nullable().optional(),
    linkedin_page_url: z.string().url().nullable().optional(),
    instagram_page_url: z.string().url().nullable().optional(),
    telegram_page_url: z.string().url().nullable().optional(),
    mandates: z.array(z.string()),
    subscription_types: z.array(z.string()).optional(),
  })
  .partial()

export const propertyPathSchema = z.enum([
  'first_name',
  'last_name',
  'gender',
  'custom_gender',
  'nationality',
  'birthdate',
  'post_address',
  'post_address.address',
  'post_address.postal_code',
  'post_address.city_name',
  'post_address.country',
  'email_address',
  'facebook_page_url',
  'twitter_page_url',
  'linkedin_page_url',
  'instagram_page_url',
  'telegram_page_url',
])

export type ProfileUpdatePropertyPath = z.infer<typeof propertyPathSchema>

export const RestUpdateProfileResponseSchema = z.string()
export type RestUpdateProfileResponse = z.infer<typeof RestUpdateProfileResponseSchema>

// -----------------  RestRemoveProfile  -----------------
export type RestRemoveProfileRequest = z.infer<typeof RestRemoveProfileRequestSchema>
export const RestRemoveProfileRequestSchema = z.void()

export type RestRemoveProfileResponse = z.infer<typeof RestRemoveProfileResponseSchema>
export const RestRemoveProfileResponseSchema = z.void()

// -----------------  RestDonations  -----------------

export type RestDonationsRequest = z.infer<typeof RestDonationsRequestSchema>
export const RestDonationsResponseSchema = z.array(
  z.object({
    uuid: z.string().uuid(),
    date: z.coerce.date(),
    type: z.enum(['cb', 'check', 'transfer', 'tpe']),
    subscription: z.boolean(),
    membership: z.boolean(),
    status: z.enum(['waiting_confirmation', 'subscription_in_progress', 'refunded', 'canceled', 'finished', 'error']),
    amount: z.number(),
  }),
)

export type RestCancelDonationRequestSchema = z.infer<typeof RestCancelDonationRequestSchema>
export const RestCancelDonationRequestSchema = z.void()

export type RestCancelDonationResponseSchema = z.infer<typeof RestCancelDonationResponseSchema>
export const RestCancelDonationResponseSchema = z.any()

export type RestDonationsResponse = z.infer<typeof RestDonationsResponseSchema>
export const RestDonationsRequestSchema = z.void()

// -----------------  RestElectedProfil  -----------------

export const RestElectedProfileRequestSchema = z.void()
export type RestElectedProfileRequest = z.infer<typeof RestElectedProfileRequestSchema>

export type RestElectedProfileResponse = z.infer<typeof RestElectedProfileResponseSchema>
export const RestElectedProfileResponseSchema = z.object({
  mandates: z.array(z.string()),
  contribution_status: z.enum(['eligible', 'not_eligible']).nullable(),
  exempt_from_cotisation: z.boolean(),
  contributed_at: z.coerce.date().nullable(),
  payments: z.array(z.object({ date: z.coerce.date(), amount: z.number(), method: z.string(), uuid: z.string().uuid(), status_label: z.string() })),
  uuid: z.string().uuid(),
  contribution_amount: z.number().nullable(),
  elect_mandates: z.array(
    z.object({
      mandate_type: z.string(),
      mandate_type_label: z.string(),
      delegation: z.string(),
      zone: z.object({
        code: z.string(),
        name: z.string(),
        uuid: z.string().uuid(),
      }),
      begin_at: z.coerce.date(),
      finish_at: z.coerce.date(),
    }),
  ),
  last_revenue_declaration: z
    .object({
      created_at: z.coerce.date(),
      amount: z.number(),
      uuid: z.string().uuid(),
    })
    .nullable(),
})

export type RestElectPaymentRequest = z.infer<typeof RestElectPaymentRequestSchema>
export const RestElectPaymentRequestSchema = z.object({
  account_name: z.string(),
  iban: z.string(),
  account_country: z.string(),
})

export type RestElectPaymentResponse = z.infer<typeof RestElectPaymentResponseSchema>
export const RestElectPaymentResponseSchema = z.any()

export const propertyPathElectPaymentSchema = z.enum(['account_name', 'iban', 'account_country'])

export type RestElectDeclarationRequest = z.infer<typeof RestElectDeclarationRequestSchema>
export const RestElectDeclarationRequestSchema = z.object({
  revenue_amount: z.number(),
})

export type RestElectDeclarationResponse = z.infer<typeof RestElectDeclarationResponseSchema>
export const RestElectDeclarationResponseSchema = z.any()

export const propertyPathDeclarationPaymentSchema = z.enum(['revenue_amount'])

// -----------------  RestProfilPicture  -----------------

export const RestPostProfilePictureRequestSchema = z.object({
  content: z.string(),
})
export type RestPostProfilePictureRequest = z.infer<typeof RestPostProfilePictureRequestSchema>
export const RestPostProfilePictureResponseSchema = z.any()

export type RestDeleteProfilePictureRequest = z.infer<typeof RestDeleteProfilePictureRequestSchema>
export const RestDeleteProfilePictureRequestSchema = z.void()
export const RestDeleteProfilePictureResponseSchema = z.any()

// -----------------  RestTaxReceipts  -----------------

export type RestTaxReceiptsRequest = z.infer<typeof RestTaxReceiptsRequestSchema>
export const RestTaxReceiptsRequestSchema = z.void()

export type RestTaxReceiptsResponse = z.infer<typeof RestTaxReceiptsResponseSchema>
export const RestTaxReceiptsResponseSchema = z.array(
  z.object({
    uuid: z.string().uuid(),
    created_at: z.coerce.date(),
    label: z.string(),
  }),
)

export const RestTaxReceiptFileRequestSchema = z.void()
export const RestTaxReceiptFileResponseSchema = z.any()

export const RestChangePasswordRequestSchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
  new_password_confirmation: z.string(),
})

export type RestChangePasswordRequest = z.infer<typeof RestChangePasswordRequestSchema>

export const RestChangePasswordResponseSchema = z.any()

export const propertyPathChangePasswordSchema = z.enum(['old_password', 'new_password', 'new_password_confirmation'])

export const RestInstancesRequestSchema = z.void()

export type RestInstancesRequest = z.infer<typeof RestInstancesRequestSchema>

export type RestInstancesResponse = z.infer<typeof RestInstancesResponseSchema>
export const RestInstancesResponseSchema = z.array(
  z.discriminatedUnion('type', [
    z.object({
      type: z.enum(['assembly', 'circonscription']),
      name: z.string(),
    }),
    z.object({
      uuid: z.string().uuid().nullable(),
      type: z.literal('committee'),
      name: z.string().nullable(),
      members_count: z.number().nullable(),
      assembly_committees_count: z.number(),
      can_change_committee: z.boolean(),
      message: z.string().nullable(),
    }),
  ]),
)
