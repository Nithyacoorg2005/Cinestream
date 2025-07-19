import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft } from 'lucide-react';

interface Choice {
  id: string;
  text: string;
  nextScene: string;
  consequence?: string;
}

interface Scene {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  choices: Choice[];
  isEnding?: boolean;
  endingType?: 'good' | 'bad' | 'neutral';
}

const InteractiveMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [sceneHistory, setSceneHistory] = useState<string[]>([]);
  const [userChoices, setUserChoices] = useState<Array<{scene: string, choice: string}>>([]);

  // Mock interactive movie data
  const interactiveScenes: Record<string, Scene> = {
    'intro': {
      id: 'intro',
      title: 'The Heist Begins',
      description: 'You are the mastermind behind the biggest heist in history. The bank vault is in sight.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 30,
      choices: [
        {
          id: 'stealth',
          text: 'Sneak in through the ventilation system',
          nextScene: 'stealth_path',
          consequence: 'Quiet approach - less risk but slower'
        },
        {
          id: 'direct',
          text: 'Walk in through the front door',
          nextScene: 'direct_path',
          consequence: 'Bold approach - faster but riskier'
        }
      ]
    },
    'stealth_path': {
      id: 'stealth_path',
      title: 'In the Vents',
      description: 'You crawl through the narrow ventilation system. You hear guards below.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 25,
      choices: [
        {
          id: 'wait',
          text: 'Wait for the guards to pass',
          nextScene: 'vault_access',
          consequence: 'Patient approach'
        },
        {
          id: 'distract',
          text: 'Create a distraction',
          nextScene: 'alarm_triggered',
          consequence: 'Risky but effective'
        }
      ]
    },
    'direct_path': {
      id: 'direct_path',
      title: 'Bold Entry',
      description: 'You walk confidently through the front door in disguise.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: 20,
      choices: [
        {
          id: 'charm',
          text: 'Charm the receptionist',
          nextScene: 'vault_access',
          consequence: 'Smooth talking'
        },
        {
          id: 'authority',
          text: 'Act with authority',
          nextScene: 'security_check',
          consequence: 'Commanding presence'
        }
      ]
    },
    'vault_access': {
      id: 'vault_access',
      title: 'The Vault',
      description: 'You\'ve reached the vault. The security system is more complex than expected.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: 35,
      choices: [
        {
          id: 'hack',
          text: 'Hack the system yourself',
          nextScene: 'good_ending',
          consequence: 'Technical expertise'
        },
        {
          id: 'explosives',
          text: 'Use explosives',
          nextScene: 'bad_ending',
          consequence: 'Destructive but fast'
        }
      ]
    },
    'alarm_triggered': {
      id: 'alarm_triggered',
      title: 'Alarm!',
      description: 'The alarm is triggered! Security is closing in.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      duration: 15,
      choices: [
        {
          id: 'fight',
          text: 'Fight your way out',
          nextScene: 'bad_ending',
          consequence: 'Violent confrontation'
        },
        {
          id: 'hide',
          text: 'Find a hiding spot',
          nextScene: 'neutral_ending',
          consequence: 'Avoid confrontation'
        }
      ]
    },
    'security_check': {
      id: 'security_check',
      title: 'Security Checkpoint',
      description: 'A security guard wants to check your credentials.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      duration: 20,
      choices: [
        {
          id: 'fake_id',
          text: 'Show fake credentials',
          nextScene: 'vault_access',
          consequence: 'Deception'
        },
        {
          id: 'bribe',
          text: 'Offer a bribe',
          nextScene: 'neutral_ending',
          consequence: 'Corruption'
        }
      ]
    },
    'good_ending': {
      id: 'good_ending',
      title: 'Perfect Heist',
      description: 'You successfully hack the system and escape with the treasure without anyone getting hurt.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      duration: 30,
      choices: [],
      isEnding: true,
      endingType: 'good'
    },
    'bad_ending': {
      id: 'bad_ending',
      title: 'Caught!',
      description: 'Your aggressive approach leads to capture. The heist has failed.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      duration: 25,
      choices: [],
      isEnding: true,
      endingType: 'bad'
    },
    'neutral_ending': {
      id: 'neutral_ending',
      title: 'Narrow Escape',
      description: 'You escape but without the treasure. At least you\'re free to try again.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: 20,
      choices: [],
      isEnding: true,
      endingType: 'neutral'
    }
  };

  useEffect(() => {
    setCurrentScene(interactiveScenes['intro']);
    setSceneHistory(['intro']);
  }, []);

  useEffect(() => {
    if (currentScene && !currentScene.isEnding) {
      const timer = setTimeout(() => {
        setShowChoices(true);
        startChoiceTimer();
      }, (currentScene.duration - 10) * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentScene]);

  const startChoiceTimer = () => {
    setTimeLeft(10);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-select first choice if no selection made
          if (!selectedChoice && currentScene && currentScene.choices.length > 0) {
            handleChoiceSelect(currentScene.choices[0].id);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChoiceSelect = (choiceId: string) => {
    if (!currentScene) return;

    const choice = currentScene.choices.find(c => c.id === choiceId);
    if (!choice) return;

    setSelectedChoice(choiceId);
    setUserChoices(prev => [...prev, { scene: currentScene.id, choice: choiceId }]);

    setTimeout(() => {
      const nextScene = interactiveScenes[choice.nextScene];
      if (nextScene) {
        setCurrentScene(nextScene);
        setSceneHistory(prev => [...prev, nextScene.id]);
        setShowChoices(false);
        setSelectedChoice(null);
        setIsPlaying(true);
      }
    }, 1000);
  };

  const restartMovie = () => {
    setCurrentScene(interactiveScenes['intro']);
    setSceneHistory(['intro']);
    setUserChoices([]);
    setShowChoices(false);
    setSelectedChoice(null);
    setIsPlaying(false);
  };

  const goToPreviousScene = () => {
    if (sceneHistory.length > 1) {
      const previousSceneId = sceneHistory[sceneHistory.length - 2];
      const previousScene = interactiveScenes[previousSceneId];
      if (previousScene) {
        setCurrentScene(previousScene);
        setSceneHistory(prev => prev.slice(0, -1));
        setUserChoices(prev => prev.slice(0, -1));
        setShowChoices(false);
        setSelectedChoice(null);
      }
    }
  };

  const getEndingMessage = () => {
    if (!currentScene?.isEnding) return '';
    
    switch (currentScene.endingType) {
      case 'good':
        return '🎉 Congratulations! You achieved the perfect heist!';
      case 'bad':
        return '💥 Mission failed! Better luck next time.';
      case 'neutral':
        return '😐 Not the best outcome, but you survived!';
      default:
        return '';
    }
  };

  const getEndingColor = () => {
    if (!currentScene?.isEnding) return '';
    
    switch (currentScene.endingType) {
      case 'good': return 'text-green-400';
      case 'bad': return 'text-red-400';
      case 'neutral': return 'text-yellow-400';
      default: return '';
    }
  };

  if (!currentScene) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Video Player */}
      <div className="relative w-full h-screen">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          onEnded={() => {
            if (currentScene.isEnding) {
              setIsPlaying(false);
            }
          }}
        >
          <source src={currentScene.videoUrl} type="video/mp4" />
        </video>

        {/* Overlay Controls */}
        <div className="absolute top-4 left-4 flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          {sceneHistory.length > 1 && !currentScene.isEnding && (
            <button
              onClick={goToPreviousScene}
              className="bg-black/60 text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors"
            >
              ← Previous Scene
            </button>
          )}
        </div>

        {/* Scene Info */}
        <div className="absolute top-4 right-4 bg-black/60 rounded-lg p-4 max-w-sm">
          <h2 className="text-xl font-bold mb-2">{currentScene.title}</h2>
          <p className="text-gray-300 text-sm">{currentScene.description}</p>
        </div>

        {/* Choice Timer */}
        {showChoices && !currentScene.isEnding && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="bg-red-600 text-white text-6xl font-bold rounded-full w-24 h-24 flex items-center justify-center mb-4 mx-auto">
              {timeLeft}
            </div>
            <p className="text-white text-lg">Choose your action!</p>
          </div>
        )}

        {/* Choices */}
        {showChoices && !currentScene.isEnding && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentScene.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice.id)}
                  disabled={selectedChoice !== null}
                  className={`bg-black/80 border-2 rounded-lg p-6 text-left hover:bg-black/90 transition-all transform hover:scale-105 ${
                    selectedChoice === choice.id
                      ? 'border-green-500 bg-green-900/50'
                      : 'border-gray-600 hover:border-white'
                  } ${selectedChoice && selectedChoice !== choice.id ? 'opacity-50' : ''}`}
                >
                  <h3 className="text-lg font-bold mb-2">{choice.text}</h3>
                  {choice.consequence && (
                    <p className="text-gray-400 text-sm">{choice.consequence}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ending Screen */}
        {currentScene.isEnding && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center max-w-2xl px-4">
              <h1 className={`text-4xl font-bold mb-4 ${getEndingColor()}`}>
                {currentScene.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6">{currentScene.description}</p>
              <p className={`text-2xl font-bold mb-8 ${getEndingColor()}`}>
                {getEndingMessage()}
              </p>

              {/* Choice Summary */}
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4">Your Journey:</h3>
                <div className="space-y-2">
                  {userChoices.map((userChoice, index) => {
                    const scene = interactiveScenes[userChoice.scene];
                    const choice = scene?.choices.find(c => c.id === userChoice.choice);
                    return (
                      <div key={index} className="text-left">
                        <span className="text-gray-400">{scene?.title}: </span>
                        <span className="text-white">{choice?.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={restartMovie}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-4 bg-black/60 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Scene:</span>
            <span className="text-white font-medium">{sceneHistory.length}</span>
            <div className="flex space-x-1">
              {sceneHistory.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-red-600"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMovie;