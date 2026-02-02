import { useState, useRef, useEffect, useCallback, ComponentRef } from "react";
import { ScrollView, NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";
import { YStack, View, Spinner, isWeb, Input, useMedia } from "tamagui";
import Text from "@/components/base/Text";
import Layout from "@/components/AppStructure/Layout/Layout";
import { VoxButton } from "@/components/Button/Button";
import { useChatbotStream } from "@/services/chatbot/hook";
import { ArrowUpRight } from "@tamagui/lucide-icons";
import { RestChatbotStartRequest } from "@/services/chatbot/schema";
import LayoutScrollView from "@/components/AppStructure/Layout/LayoutScrollView";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import InternAlert from "@/components/InternAlert/InternAlert";

type Message = { role: "user" | "assistant"; content: string; };

type TamaguiInputRef = ComponentRef<typeof Input> & {
  getNativeRef?: () => ComponentRef<typeof Input> | null;
};

export default function ChatbotPage() {
  const media = useMedia();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [params, setParams] = useState<RestChatbotStartRequest>({ messages: [] });
  const [enabled, setEnabled] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TamaguiInputRef>(null);
  const keyboardHeight = useKeyboardHeight();

  const { data: chunks, isFetching } = useChatbotStream(params, enabled);
  const streamText = Array.isArray(chunks) ? chunks.join('') : (chunks || '');

  const scrollToBottom = () => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamText]);

  const send = useCallback(() => {
    if (!input.trim() || isFetching) return;
    const newMsgs = [...messages, ...(streamText ? [{ role: "assistant", content: streamText } as Message] : []), { role: "user", content: input } as Message];
    setMessages(newMsgs);
    setParams({ messages: newMsgs });
    setEnabled(true);
    setInput("");
  }, [input, isFetching, messages, streamText]);

  // Gestion des événements clavier sur le web pour l'input
  useEffect(() => {
    if (!isWeb || !inputRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
      // Si Maj+Entrée, laisser le comportement par défaut (saut de ligne)
    };

    const element = inputRef.current;
    const textarea = element?.getNativeRef?.() || element;
    const nativeNode = (textarea as { _nativeNode?: HTMLElement })?._nativeNode;
    const domElement = nativeNode || (textarea as unknown as HTMLElement | null);

    if (domElement && domElement instanceof HTMLElement) {
      domElement.addEventListener('keydown', handleKeyDown);
      return () => {
        domElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isWeb, send]);

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    // Sur le web : Entrée seule = envoi, Maj+Entrée = saut de ligne
    if (isWeb) {
      const key = e.nativeEvent.key;
      const shiftKey = (e.nativeEvent as TextInputKeyPressEventData & { shiftKey?: boolean }).shiftKey;

      if (key === 'Enter' && !shiftKey) {
        // Empêcher le comportement par défaut et envoyer le message
        e.preventDefault?.();
        send();
        return false;
      }
      // Si Maj+Entrée, laisser le comportement par défaut (saut de ligne)
    }
    // Sur mobile : onSubmitEditing gère l'envoi
  };

  return (
    <Layout.Main>
      <YStack position="relative" flex={1} minHeight={isWeb ? "100dvh" : "100%"} gap="$medium">
        <LayoutScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: isWeb ? 32 : 32 + keyboardHeight,
            minHeight: '100%',
            ...(isWeb ? { flex: 1 } : {})
          }}
          onContentSizeChange={scrollToBottom}
        >
          {!isWeb && (
            <InternAlert type="warning" marginHorizontal="$medium" marginTop="$medium">
              Ce POC n'est pas encore disponible sur mobile. Veuillez utiliser la version web.
            </InternAlert>
          )}
          {messages.map((m, i) => (
            <View
              key={i}
              alignSelf={m.role === "user" ? "flex-end" : "flex-start"}
              maxWidth={m.role === "user" ? "80%" : "100%"}
              bg={m.role === "user" ? "$textOutline20" : undefined}
              p="$medium"
              borderTopLeftRadius="$medium"
              borderTopRightRadius="$xsmall"
              borderBottomLeftRadius="$medium"
              borderBottomRightRadius="$medium"
            >
              <Text>{m.content}</Text>
            </View>
          ))}
          {enabled && (
            <View alignSelf="flex-start" p="$medium" br="$medium">
              {streamText ? <Text>{streamText}</Text> : <Spinner size="small" />}
            </View>
          )}
        </LayoutScrollView>
        <YStack
          position={isWeb ? 'sticky' : 'absolute'}
          bottom={isWeb ? 0 : keyboardHeight}
          left={0}
          right={0}
          zIndex={100}
          bg="$textSurface"
          pb={media.gtMd ? "$medium" : 0}
        >
          <YStack
            backgroundColor="$white1"
            borderColor="$textOutline"
            borderWidth={1}
            borderTopLeftRadius={24}
            borderTopRightRadius={24}
            borderBottomLeftRadius={media.gtMd ? 24 : 0}
            borderBottomRightRadius={media.gtMd ? 24 : 0}
            overflow="hidden"
          >
            <View paddingTop={8}>
              <Input
                ref={inputRef}
                multiline
                value={input}
                onChangeText={setInput}
                onKeyPress={!isWeb ? handleKeyPress : undefined}
                onSubmitEditing={isWeb ? undefined : send}
                borderWidth={0}
                focusStyle={{
                  outlineWidth: 0,
                }}
                maxHeight={160}
                textAlignVertical="top"
                placeholder={isWeb ? "Formulez votre demande" : "Non disponible sur mobile"}
                editable={isWeb}
                opacity={isWeb ? 1 : 0.5}
              />
            </View>
            <View flex={1} pb="$medium" pt={4} paddingHorizontal={16}>
              <VoxButton theme="blue" onPress={send} iconLeft={ArrowUpRight} shrink loading={isFetching} disabled={!input.trim() || isFetching || !isWeb} alignSelf="flex-end" />
            </View>
          </YStack>
        </YStack>
      </YStack>
    </Layout.Main>
  );
}
