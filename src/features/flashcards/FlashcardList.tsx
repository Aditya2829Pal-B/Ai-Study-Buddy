import React from 'react';
import { Flashcard } from './Flashcard';
import { useSearchStore } from '../../stores/useSearchStore';

interface FlashcardListProps {
  flashcards: Array<{ front: string; back: string }>;
}

export function FlashcardList({ flashcards }: FlashcardListProps) {
  const { searchQuery } = useSearchStore();

  const filtered = flashcards.filter(f => 
    f.front.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.back.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filtered.map((card, idx) => (
        <Flashcard key={idx} id={`card-${idx}`} front={card.front} back={card.back} />
      ))}
    </div>
  );
}
