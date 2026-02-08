import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
      <DialogContent className="max-w-[650px] glass-card border-[rgba(255,255,255,0.1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
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
