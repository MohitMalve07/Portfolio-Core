import { LETTERBOX_PLACEMENT } from '../../data/contact';
import { LetterBoxModel } from './LetterBoxModel';
import { LetterReveal } from './LetterReveal';

interface ContactShowcaseProps {
  isInteractive: boolean;
  letterStage: 'closed' | 'revealing' | 'open';
  onOpenMailbox: () => void;
  onRevealComplete: () => void;
}

/**
 * Places the LetterBox on the cabin floor left of the fireplace and coordinates
 * the mailbox opening + emerging envelope reveal.
 */
export function ContactShowcase({
  isInteractive,
  letterStage,
  onOpenMailbox,
  onRevealComplete,
}: ContactShowcaseProps) {
  const isActivated = letterStage !== 'closed';

  return (
    <group
      name="Contact_LetterBox_Group"
      position={LETTERBOX_PLACEMENT.position}
      rotation={[0, LETTERBOX_PLACEMENT.rotationY, 0]}
      scale={LETTERBOX_PLACEMENT.scale}
    >
      <LetterBoxModel
        isInteractive={isInteractive}
        isActivated={isActivated}
        onOpen={onOpenMailbox}
      />

      <LetterReveal
        isRevealing={letterStage === 'revealing'}
        isVisible={letterStage === 'open'}
        onRevealComplete={onRevealComplete}
      />

      {/* Soft localized accent on the mantel LetterBox when viewing Contact */}
      {isInteractive && (
        <pointLight
          position={[0.45, 1.1, 1.25]}
          color="#ffe0ad"
          intensity={0.9}
          distance={2.2}
          decay={2}
        />
      )}
    </group>
  );
}
