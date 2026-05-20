import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AICoachService, AIMessage } from "../services/aiCoach";

export default function ChatScreen() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const history = await AICoachService.loadHistory();
    if (history.length === 0) {
      const welcome: AIMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: AICoachService.getWelcomePrompt(),
        timestamp: Date.now(),
      };
      setMessages([welcome]);
      await AICoachService.saveMessage(welcome);
    } else {
      setMessages(history);
    }
  }

  async function handleSend() {
    if (!inputText.trim() || isThinking) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsThinking(true);

    await AICoachService.saveMessage(userMessage);

    try {
      const { response } = await AICoachService.sendMessage(inputText);

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await AICoachService.saveMessage(assistantMessage);
    } catch {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm experiencing technical difficulties. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  }

  function renderMessage({ item }: { item: AIMessage }) {
    const isUser = item.role === "user";
    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>AI Coach</Text>
          <Text style={styles.headerSubtitle}>
            Powered by Claude — your metabolic wellness guide
          </Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            await AICoachService.clearHistory();
            setMessages([]);
            loadHistory();
          }}
        >
          <Text style={styles.clearButton}>Clear Chat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      {isThinking && (
        <View style={styles.thinkingIndicator}>
          <Text style={styles.thinkingText}>Thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask about recovery, sleep, meals, activity..."
          placeholderTextColor="#94a8b8"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isThinking) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isThinking}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D3B3B",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#0D3B3B",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#5bb8b8",
    marginTop: 2,
  },
  clearButton: {
    fontSize: 14,
    color: "#94a8b8",
  },
  messageList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: "row",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#6366f1",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#1a4f4f",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 11,
    color: "#94a8b8",
    marginTop: 4,
    textAlign: "left",
  },
  userTimestamp: {
    textAlign: "right",
  },
  thinkingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  thinkingText: {
    fontSize: 14,
    color: "#94a8b8",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1a4f4f",
    borderTopWidth: 1,
    borderTopColor: "#2a5a5a",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#0D3B3B",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#fff",
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: "#6366f1",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    backgroundColor: "#4a4a6a",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
