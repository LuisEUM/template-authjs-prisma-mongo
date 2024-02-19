import React from "react";
import CardList from "../cards-list/CardList";

interface CardGroupListProps {
  title: string;
  list: any[];
  renderButtons: (files: any, fileType: string) => JSX.Element[];
}

const CardGroupList: React.FC<CardGroupListProps> = ({
  title,
  list,
  renderButtons,
}) => {
  return (
    <div className="gap-2 flex flex-row flex-wrap items-start justify-center">
      <h3 className="text-center w-full font-bold text-2xl mt-4">{title}</h3>
      <CardList list={list} renderButtons={renderButtons} />
    </div>
  );
};

export default CardGroupList;
