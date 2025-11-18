import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle,
  Crown,
  Lock
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Section } from '../components/ui/Section';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  coachName?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    content: "Hi! I'm Coach Mike. How can I help you with your fitness journey today?",
    sender: 'coach',
    timestamp: new Date(Date.now() - 86400000),
    coachName: 'Coach Mike',
  },
  {
    id: '2',
    content: "Hi Coach! I wanted to ask about my nutrition plan. Should I increase my protein intake?",
    sender: 'user',
    timestamp: new Date(Date.now() - 82800000),
  },
  {
    id: '3',
    content: "Great question! Based on your current goals and activity level, I'd recommend increasing your protein to about 1.2g per pound of body weight. Let's discuss this more in your next session.",
    sender: 'coach',
    timestamp: new Date(Date.now() - 79200000),
    coachName: 'Coach Mike',
  },
];

export const MessageCoachPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
        // Check if user has Pro or Elite plan
        const plan = data.subscription_package?.toLowerCase();
        setHasAccess(plan === 'pro' || plan === 'elite');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // TODO: Send to backend/real-time messaging service
    // For now, simulate a coach response after 2 seconds
    setTimeout(() => {
      const coachReply: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! I'll get back to you shortly with a detailed response.",
        sender: 'coach',
        timestamp: new Date(),
        coachName: 'Coach Mike',
      };
      setMessages(prev => [...prev, coachReply]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black pt-24 md:pt-28 pb-20 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 w-full">
          {/* Close/Back Button */}
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            Back to Dashboard
          </Button>

          {/* Modal Card */}
          <div className="relative bg-black dark:bg-gray-900 rounded-3xl p-8 border-2 border-gray-800 dark:border-gray-700 shadow-2xl">
            {/* Pro Feature Badge */}
            <div className="absolute top-6 right-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary text-black">
                Pro Feature
              </span>
            </div>

            {/* Message Icon */}
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4">
              <MessageCircle className="w-10 h-10 text-primary" strokeWidth={2.5} />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-display font-bold text-white text-center mb-4">
              Message Coach
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-center mb-8 text-lg">
              Upgrade to Pro or Elite to message your coach
            </p>

            {/* Upgrade Button */}
            <button
              onClick={() => navigate('/pricing')}
              className="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-4 px-6 rounded-2xl transition-colors inline-flex items-center justify-center gap-2 group"
            >
              <span>Upgrade Plan</span>
              <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Benefits List */}
            <div className="mt-8 pt-8 border-t border-gray-800 dark:border-gray-700">
              <h3 className="font-semibold text-white mb-4 text-center">
                Included in Pro & Elite:
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Direct messaging with your dedicated coach</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Personalized workout and nutrition advice</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Quick answers to your fitness questions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Priority support with faster response times</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-24 md:pt-28 pb-20">
      <Section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400">Coach Online</span>
            </div>
          </div>

          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                    Coach Mike
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your Personal Trainer
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardBody className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender === 'user'
                        ? 'bg-primary text-dark'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
                    } rounded-2xl px-4 py-3`}
                  >
                    {message.sender === 'coach' && message.coachName && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {message.coachName}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-dark/70'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </CardBody>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  leftIcon={<Send className="w-5 h-5" />}
                >
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
};

export default MessageCoachPage;

