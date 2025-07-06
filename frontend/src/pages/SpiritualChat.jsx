import React, { useEffect } from "react";
import { useChat } from "../contexts/ChatContext";
import ChatInterface from "../components/ChatInterface";

const SpiritualChat = () => {
  const { getWelcomeMessage, welcomeMessage } = useChat();

  useEffect(() => {
    // Get the welcome message when component mounts
    getWelcomeMessage("spiritual");
  }, [getWelcomeMessage]);

  return (
    <ChatInterface
      title="Spiritual Guidance"
      subtitle="Explore spiritual questions and find inner peace through meaningful conversation"
      initialMessage={
        welcomeMessage ||
        "Welcome to this sacred space for spiritual exploration. I'm here to support you on your spiritual journey, whether you're seeking guidance, exploring questions about meaning and purpose, or looking for inner peace. I respect all spiritual traditions and beliefs. What's on your heart today?"
      }
      disclaimer="This AI assistant provides general spiritual guidance and philosophical discussion. It respects all religious and spiritual traditions. The guidance offered here is not affiliated with any specific religious organization and should complement, not replace, your personal spiritual practices or guidance from spiritual leaders in your tradition."
      aiContext="spiritual"
    />
  );
};

export default SpiritualChat;
