import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, LayoutDashboard, ExternalLink, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { AssistantChat } from '../components/assistant/AssistantChat';

interface Activity {
  id: string;
  type: 'task' | 'report' | 'summary';
  title: string;
  status: 'in_progress' | 'completed' | 'pending';
  date: string;
  description: string;
}

export function Assistant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGreeting, setIsGreeting] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'task',
      title: 'Portfolio Review - John Smith',
      status: 'in_progress',
      date: '2024-02-20',
      description: 'Analyzing portfolio performance and preparing recommendations'
    },
    {
      id: '2',
      type: 'report',
      title: 'Q1 Market Analysis',
      status: 'completed',
      date: '2024-02-19',
      description: 'Comprehensive market analysis for Q1 2024'
    },
    {
      id: '3',
      type: 'summary',
      title: 'Client Meeting Summary - Sarah Johnson',
      status: 'completed',
      date: '2024-02-18',
      description: 'Meeting notes and action items from portfolio review'
    },
    {
      id: '4',
      type: 'task',
      title: 'Tax Document Preparation',
      status: 'pending',
      date: '2024-02-21',
      description: 'Gathering and organizing client tax documents'
    },
    {
      id: '5',
      type: 'report',
      title: 'Risk Assessment Update',
      status: 'in_progress',
      date: '2024-02-20',
      description: 'Updating client portfolio risk assessments'
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGreeting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <div className={cn(
              "w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center",
              "before:content-[''] before:absolute before:w-16 before:h-16 before:rounded-full",
              "before:border-2 before:border-indigo-400 before:animate-pulse"
            )}>
              <Brain className="w-6 h-6" />
            </div>
          </div>
          <button
            onClick={navigateToDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={cn(
                "transition-opacity duration-1000",
                isGreeting ? "opacity-100" : "opacity-0"
              )}>
                <h1 className="text-2xl font-bold">
                  Hello {user?.name?.split(' ')[0]},
                </h1>
              </div>
            </div>
            <AssistantChat />
          </div>

          <div className={cn(
            "transition-opacity duration-1000 delay-500",
            !isGreeting ? "opacity-100" : "opacity-0"
          )}>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
              <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => handleActivityClick(activity)}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        getStatusColor(activity.status)
                      )} />
                      <div>
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-gray-400">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm capitalize">{activity.status.replace(/_/g, ' ')}</div>
                        <div className="text-sm text-gray-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-semibold">{selectedActivity.title}</h2>
                <p className="text-gray-400">
                  {selectedActivity.type.charAt(0).toUpperCase() + selectedActivity.type.slice(1)}
                </p>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    getStatusColor(selectedActivity.status)
                  )} />
                  <span className="capitalize">
                    {selectedActivity.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Description</div>
                <p>{selectedActivity.description}</p>
              </div>
              <div>
                <div className="text-sm text-gray-400">Date</div>
                <p>{new Date(selectedActivity.date).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={navigateToDashboard}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  View in Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}