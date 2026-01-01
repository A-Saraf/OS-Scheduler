import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[650px] bg-gradient-to-br from-[hsl(222,47%,5%)] to-[hsl(217,33%,10%)] border-[rgba(255,255,255,0.1)]">
        <DialogHeader className="relative">
          <button
            onClick={onClose}
            className="modal-close"
          >
            <X size={18} />
          </button>
          <DialogTitle className="text-2xl font-bold gradient-text pr-10">
            {title}
          </DialogTitle>
          <div className="modal-divider mt-4" />
        </DialogHeader>
        
        <p className="text-[15px] leading-[1.8] text-muted-foreground">
          {description}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AlgorithmInfoModal;
