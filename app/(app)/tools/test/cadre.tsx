import React from 'react'
import Head from 'expo-router/head'
import * as metatags from '@/config/metatags'
import { YStack } from 'tamagui'
import VoxCard from '@/components/VoxCard/VoxCard'
import Text from '@/components/base/Text'
import Layout from '@/components/Navigation/Layout'

function TestScreen() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Test')}</title>
      </Head>
      <TestPage />
    </>
  )
}

const TestPage = () => {
  return (
    <Layout sidebarState="cadre">
      <Layout.ScrollView>
        <Layout.Container>
          <Layout.Main maxWidth="auto">
            <YStack gap={16}>
                <VoxCard>
                  <VoxCard.Content>
                    <Text.LG>Test 1</Text.LG>
                    <Text.MD>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis sollicitudin nunc. Pellentesque facilisis malesuada augue ac maximus. Pellentesque faucibus elementum tellus, a hendrerit magna faucibus et. Fusce sodales aliquam posuere. Pellentesque odio sem, pellentesque ut posuere in, posuere sit amet quam. Donec congue lorem ut erat sollicitudin malesuada vitae in augue. Etiam nec quam in magna mollis suscipit. Fusce sed lorem at ex feugiat sollicitudin. Etiam scelerisque imperdiet mi, id interdum lorem. Sed aliquet a ipsum ut dignissim. Aliquam elementum, lorem vel auctor sodales, ex metus placerat massa, vel aliquet magna risus vitae turpis. Duis a dolor ac odio sagittis aliquam.</Text.MD>
                    <Text.MD>Nunc ornare quam eu felis venenatis, ac scelerisque dolor consectetur. Aenean viverra tortor ac euismod scelerisque. Aenean molestie libero quis dolor aliquam, fringilla condimentum sapien porttitor. Integer placerat non augue quis congue. Pellentesque at enim vitae massa ultrices placerat. Vestibulum lobortis at odio at blandit. Aliquam ultrices elit a felis tristique dapibus. Ut in tempor justo.</Text.MD>
                    <Text.MD>Suspendisse a euismod elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam nunc metus, elementum id ex quis, ultricies congue velit. Vivamus eu semper nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex libero, ac rhoncus libero ullamcorper sit amet. Phasellus ex velit, sagittis eu pharetra non, porta in odio. Donec aliquet tempor augue, eget condimentum lectus scelerisque eu. Etiam cursus ipsum dui, vel laoreet nibh varius tincidunt. Cras scelerisque odio non posuere euismod. Aliquam consectetur blandit ligula sit amet scelerisque. Fusce venenatis consequat lorem non egestas.</Text.MD>
                  </VoxCard.Content>
                </VoxCard>
                <VoxCard>
                  <VoxCard.Content>
                    <Text.LG>Test Page 2</Text.LG>
                    <Text.MD>Integer iaculis libero ut libero volutpat venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet porttitor metus, nec sollicitudin orci. Phasellus id nisi ac enim laoreet ultrices. Aenean et dui non magna faucibus dignissim at in leo. Pellentesque pulvinar congue urna a lacinia. Ut dapibus sapien tincidunt tellus dignissim molestie. Vivamus aliquet, est in ornare pretium, enim tellus accumsan tellus, sed blandit neque libero vel tellus. Cras vehicula nec lectus vitae faucibus. Nulla et mauris scelerisque, euismod elit ut, malesuada orci. Phasellus at sem mollis, venenatis purus eu, varius orci. Sed eu massa massa. Etiam accumsan ligula arcu. Mauris a consectetur lorem. Cras posuere urna at lorem consequat, tincidunt molestie mauris finibus.</Text.MD>
                  </VoxCard.Content>
                </VoxCard>
                <VoxCard>
                  <VoxCard.Content>
                    <Text.LG>Test Page 3</Text.LG>
                    <Text.MD>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis sollicitudin nunc. Pellentesque facilisis malesuada augue ac maximus. Pellentesque faucibus elementum tellus, a hendrerit magna faucibus et. Fusce sodales aliquam posuere. Pellentesque odio sem, pellentesque ut posuere in, posuere sit amet quam. Donec congue lorem ut erat sollicitudin malesuada vitae in augue. Etiam nec quam in magna mollis suscipit. Fusce sed lorem at ex feugiat sollicitudin. Etiam scelerisque imperdiet mi, id interdum lorem. Sed aliquet a ipsum ut dignissim. Aliquam elementum, lorem vel auctor sodales, ex metus placerat massa, vel aliquet magna risus vitae turpis. Duis a dolor ac odio sagittis aliquam.</Text.MD>
                    <Text.MD>Nunc ornare quam eu felis venenatis, ac scelerisque dolor consectetur. Aenean viverra tortor ac euismod scelerisque. Aenean molestie libero quis dolor aliquam, fringilla condimentum sapien porttitor. Integer placerat non augue quis congue. Pellentesque at enim vitae massa ultrices placerat. Vestibulum lobortis at odio at blandit. Aliquam ultrices elit a felis tristique dapibus. Ut in tempor justo.</Text.MD>
                  </VoxCard.Content>
                </VoxCard>
                <VoxCard>
                  <VoxCard.Content>
                    <Text.LG>Test Page 4</Text.LG>
                    <Text.MD>Suspendisse a euismod elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam nunc metus, elementum id ex quis, ultricies congue velit. Vivamus eu semper nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex libero, ac rhoncus libero ullamcorper sit amet. Phasellus ex velit, sagittis eu pharetra non, porta in odio. Donec aliquet tempor augue, eget condimentum lectus scelerisque eu. Etiam cursus ipsum dui, vel laoreet nibh varius tincidunt. Cras scelerisque odio non posuere euismod. Aliquam consectetur blandit ligula sit amet scelerisque. Fusce venenatis consequat lorem non egestas.</Text.MD>
                    <Text.MD>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis sollicitudin nunc. Pellentesque facilisis malesuada augue ac maximus. Pellentesque faucibus elementum tellus, a hendrerit magna faucibus et. Fusce sodales aliquam posuere. Pellentesque odio sem, pellentesque ut posuere in, posuere sit amet quam. Donec congue lorem ut erat sollicitudin malesuada vitae in augue. Etiam nec quam in magna mollis suscipit. Fusce sed lorem at ex feugiat sollicitudin. Etiam scelerisque imperdiet mi, id interdum lorem. Sed aliquet a ipsum ut dignissim. Aliquam elementum, lorem vel auctor sodales, ex metus placerat massa, vel aliquet magna risus vitae turpis. Duis a dolor ac odio sagittis aliquam.</Text.MD>
                    <Text.MD>Nunc ornare quam eu felis venenatis, ac scelerisque dolor consectetur. Aenean viverra tortor ac euismod scelerisque. Aenean molestie libero quis dolor aliquam, fringilla condimentum sapien porttitor. Integer placerat non augue quis congue. Pellentesque at enim vitae massa ultrices placerat. Vestibulum lobortis at odio at blandit. Aliquam ultrices elit a felis tristique dapibus. Ut in tempor justo.</Text.MD>
                  </VoxCard.Content>
                </VoxCard>
                <VoxCard>
                  <VoxCard.Content>
                    <Text.LG>Test 5</Text.LG>
                    <Text.MD>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis sollicitudin nunc. Pellentesque facilisis malesuada augue ac maximus. Pellentesque faucibus elementum tellus, a hendrerit magna faucibus et. Fusce sodales aliquam posuere. Pellentesque odio sem, pellentesque ut posuere in, posuere sit amet quam. Donec congue lorem ut erat sollicitudin malesuada vitae in augue. Etiam nec quam in magna mollis suscipit. Fusce sed lorem at ex feugiat sollicitudin. Etiam scelerisque imperdiet mi, id interdum lorem. Sed aliquet a ipsum ut dignissim. Aliquam elementum, lorem vel auctor sodales, ex metus placerat massa, vel aliquet magna risus vitae turpis. Duis a dolor ac odio sagittis aliquam.</Text.MD>
                    <Text.MD>Nunc ornare quam eu felis venenatis, ac scelerisque dolor consectetur. Aenean viverra tortor ac euismod scelerisque. Aenean molestie libero quis dolor aliquam, fringilla condimentum sapien porttitor. Integer placerat non augue quis congue. Pellentesque at enim vitae massa ultrices placerat. Vestibulum lobortis at odio at blandit. Aliquam ultrices elit a felis tristique dapibus. Ut in tempor justo.</Text.MD>
                    <Text.MD>Suspendisse a euismod elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam nunc metus, elementum id ex quis, ultricies congue velit. Vivamus eu semper nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex libero, ac rhoncus libero ullamcorper sit amet. Phasellus ex velit, sagittis eu pharetra non, porta in odio. Donec aliquet tempor augue, eget condimentum lectus scelerisque eu. Etiam cursus ipsum dui, vel laoreet nibh varius tincidunt. Cras scelerisque odio non posuere euismod. Aliquam consectetur blandit ligula sit amet scelerisque. Fusce venenatis consequat lorem non egestas.</Text.MD>
                  </VoxCard.Content>
                </VoxCard>
                <VoxCard>
                  <VoxCard.Content>
                    <Text.LG>Test Page 6</Text.LG>
                    <Text.MD>Integer iaculis libero ut libero volutpat venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet porttitor metus, nec sollicitudin orci. Phasellus id nisi ac enim laoreet ultrices. Aenean et dui non magna faucibus dignissim at in leo. Pellentesque pulvinar congue urna a lacinia. Ut dapibus sapien tincidunt tellus dignissim molestie. Vivamus aliquet, est in ornare pretium, enim tellus accumsan tellus, sed blandit neque libero vel tellus. Cras vehicula nec lectus vitae faucibus. Nulla et mauris scelerisque, euismod elit ut, malesuada orci. Phasellus at sem mollis, venenatis purus eu, varius orci. Sed eu massa massa. Etiam accumsan ligula arcu. Mauris a consectetur lorem. Cras posuere urna at lorem consequat, tincidunt molestie mauris finibus.</Text.MD>
                    <Text.MD>Nullam ut ligula quam. Proin quis velit risus. Nunc fermentum sagittis enim, et porttitor lectus bibendum quis. In ullamcorper, erat sit amet rhoncus pretium, mi ligula pellentesque ante, facilisis tempor lectus enim eu lectus. Morbi malesuada neque eget justo tempus, quis feugiat purus mollis. Curabitur lobortis erat non tristique condimentum. Duis vulputate neque non libero aliquet feugiat. In ac massa ac nunc feugiat ultrices sed volutpat odio. Vestibulum commodo vitae nibh quis suscipit.</Text.MD>
                    <Text.MD>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sed pellentesque libero, id lobortis elit. Aliquam ut urna ex. Aliquam et nisi risus. Donec tortor purus, molestie eu sem sed, hendrerit ullamcorper felis. Proin ut velit id dui venenatis feugiat. Nullam sed orci urna. Phasellus sollicitudin risus id tellus mattis finibus. Donec turpis nunc, malesuada nec convallis suscipit, faucibus in dolor. Curabitur non diam in dolor porta hendrerit eu sit amet ex.</Text.MD>
                  </VoxCard.Content>
                </VoxCard>
            </YStack>
          </Layout.Main>
        </Layout.Container>
      </Layout.ScrollView>
    </Layout>
  )
}

export default TestScreen