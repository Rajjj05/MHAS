import React, { useEffect } from "react";
import { useChat } from "../contexts/ChatContext";
import ChatInterface from "../components/ChatInterface";

const MentalHealthChat = () => {
  const { getWelcomeMessage, welcomeMessage } = useChat();

  useEffect(() => {
    // Get the welcome message when component mounts
    getWelcomeMessage("mental-health");
  }, [getWelcomeMessage]);

  return (
    <ChatInterface
      title="Mental Health Support"
      subtitle="A safe space to discuss your mental health concerns with AI support"
      initialMessage={
        welcomeMessage ||
        "Hello! I'm here to provide a supportive space for you to discuss your mental health concerns. While I can offer guidance and coping strategies, please remember that I'm not a replacement for professional mental health care. How are you feeling today?"
      }
      disclaimer="This AI assistant is designed to provide supportive conversations and general mental health information. It is not a substitute for professional medical advice, diagnosis, or treatment. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately."
      emergencyInfo="If you're having thoughts of self-harm or suicide, please reach out immediately: National Suicide Prevention Lifeline: 988 | Crisis Text Line: Text HOME to 741741 | Emergency Services: 911"
      aiContext="mental-health"
    />
  );
};

export default MentalHealthChat;
