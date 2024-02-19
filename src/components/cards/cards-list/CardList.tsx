// CardList.tsx
import React from 'react';
import CardsPosters from '../posters/CardsPosters';

interface CardListProps {
  list: any[];
  renderButtons: (files: any, fileType: string) => JSX.Element[];
}

const CardList: React.FC<CardListProps> = ({ list, renderButtons }) => {
  return (
    <>
      {list &&
        list.map((item: any, index: number) => (
          <CardsPosters
            key={index}
            item={item}
            renderButtons={renderButtons}
          />
        ))}
    </>
  );
};

export default CardList;