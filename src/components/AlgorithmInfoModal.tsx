import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Volume2 } from 'lucide-react';

interface AlgorithmInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const AlgorithmInfoModal: React.FC<AlgorithmInfoModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const speakAlgorithmInfo = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    setIsSpeaking(true);

    // Create concise, informative speech text
    let speechText = `${title}. `;
    
    // Extract key points from description (make it more concise)
    const sentences = description.split('.').filter(s => s.trim().length > 0);
    // Take first 3-4 most important sentences
    const keySentences = sentences.slice(0, Math.min(4, sentences.length));
    speechText += keySentences.join('. ') + '.';

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.1; // Natural speaking rate
    utterance.pitch = 0.95; // Slightly lower pitch for more natural sound
    utterance.volume = 0.85;
    
    // Try to select the most natural, humanized voice
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order for most natural voices
    const naturalVoices = [
      // Google voices (usually very natural)
      ...voices.filter(v => v.name.includes('Google') && v.lang.includes('en')),
      // Microsoft high-quality voices
      ...voices.filter(v => v.name.includes('Microsoft') && (
        v.name.includes('Zira') || v.name.includes('David') || 
        v.name.includes('Mark') || v.name.includes('Hazel')
      )),
      // macOS natural voices
      ...voices.filter(v => v.name.includes('Samantha') || v.name.includes('Karen')),
      // Amazon Polly-like voices if available
      ...voices.filter(v => v.name.includes('Joanna') || v.name.includes('Matthew') || v.name.includes('Kendra')),
      // Other high-quality voices
      ...voices.filter(v => v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('Susan')),
      // Neural voices if available
      ...voices.filter(v => v.name.includes('Neural') || v.name.includes('Premium')),
      // Any English voice with "Natural" in name
      ...voices.filter(v => v.name.includes('Natural') && v.lang.includes('en')),
      // Fallback to any English voice
      ...voices.filter(v => v.lang.includes('en'))
    ];
    
    // Remove duplicates and get the best available voice
    const uniqueVoices = [...new Map(naturalVoices.map(v => [v.name, v])).values()];
    const preferredVoice = uniqueVoices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log('Using voice:', preferredVoice.name, preferredVoice.lang);
    } else {
      console.log('Using default voice');
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 max-h-[90vh] overflow-y-auto glass-card border-[rgba(255,255,255,0.1)]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold gradient-text">
              {title}
            </DialogTitle>
            <button
              onClick={speakAlgorithmInfo}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                isSpeaking 
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30'
              }`}
              title={isSpeaking ? "Stop speaking" : "Speak algorithm information"}
            >
              <Volume2 size={18} />
            </button>
          </div>
          <div className="modal-divider mt-4" />
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-[15px] leading-[1.8] text-muted-foreground">
            {description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlgorithmInfoModal;
