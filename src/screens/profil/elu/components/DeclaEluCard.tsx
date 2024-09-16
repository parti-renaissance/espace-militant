import Badge from '@/components/Badge'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { useGetTags } from '@/services/profile/hook'
import { XStack, YStack } from 'tamagui'

export default function () {
  const { isPending, open: handlePress } = useOpenExternalContent({ slug: 'contribution' })

  const [isElu] = useGetTags({ tags: ['elu'] }) ?? [undefined]
  return isElu ? (
    <VoxCard>
      <VoxCard.Content>
        <YStack gap="$4">
          <XStack>
            <Badge theme="orange">Soumis à cotisation</Badge>
          </XStack>
          <Text.H2>En tant qu’élu, vous êtes redevable d’une cotisation élu au parti.</Text.H2>
          <VoxButton theme="blue" onPress={handlePress} disabled={isPending}>
            Gérer ma cotisation
          </VoxButton>
        </YStack>

        <VoxCard inside bg="$gray0">
          <VoxCard.Content>
            <YStack gap="$4">
              <Text.P>
                En application de l’article 4.1.2 du Règlement Intérieur, les élus titulaires de mandats électifs locaux ouvrant droit à indemnisation doivent
                s’acquitter d’une cotisation mensuelle dont le montant est fixé suivant le barème décidé par le Bureau Exécutif du 28 novembre 2022.
              </Text.P>
              <Text.H2>Comment est calculé le montant de la coisation élu ?</Text.H2>
              <Text.P>
                La cotisation calculée est égale à 2% du montant de l’ensemble des indemnités brutes perçues par l’adhérent, avec un plafond fixé à 200€ et un
                seuil de déclenchement à partir de 250€ d’indemnités mensuelles brutes.
                {'\n'}
                {'\n'}
                Par exemple,
                <Text.P>
                  {'\n'}
                  {'\t'}- Si vos indemnités brutes sont de 200 euros, vous ne serez pas redevable de cotisation élu ;{'\n'}
                  {'\t'}- Si vos indemnités brutes sont de 6 000 euros, vous serez redevable de 6 000 x 0,02 = 120 euros ;{'\n'}
                  {'\t'}
                  -Si vos indemnités brutes sont de 12 000 euros brutes, vous serez redevable du plafond de cotisation de 200 euros.
                </Text.P>
              </Text.P>

              <Text.H2>Pourquoi déclarer/cotiser ?</Text.H2>
              <Text.P>
                Les cotisations d’élus sont entièrement versées au budget de votre assemblée départementale, en cotisant vous financez donc le parti localement.
                {'\n'}
                {'\n'}
                Si vous êtes Député, elle vous donne le droit aux accès « Délégué de corconscription » qui vous donnent les moyens de contacter par email et
                notifications les militants de votre circonscription, de créer des événements et d’autres fonctionnalités.
              </Text.P>

              <Text.H2>Dois-je également cotiser en tant qu’adhérent ?</Text.H2>
              <Text.P>
                La cotisation élu replace la cotisation adhérent, vous serez donc à jour de cotiation adhérent et pourrez participer aux élections internes et
                aux consultations sans avoir à re-cotiser chaque année.
                {'\n'}
                {'\n'}
                Attention : si vous ne versez pas de cotisation élu car vous êtes exempté ou non soumis à cotisation élu, vous n’êtes pas exempté de cotisation
                adhérent.
              </Text.P>

              <Text.H2>Puis-je être exempté de cotisation élu ?</Text.H2>
              <Text.P>
                Le bureau de votre Assemblée départementale peut décider de vous exempter de cotisation si vous n’avez pas de mandat national.
                {'\n'}
                {'\n'}
                En étant exempté vous serez considéré comme à jour de cotisation élu tant que vous êtes à jour de cotisation adhérent.
              </Text.P>
            </YStack>
          </VoxCard.Content>
        </VoxCard>
      </VoxCard.Content>
    </VoxCard>
  ) : null
}