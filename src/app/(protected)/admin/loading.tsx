import CardWrapper from "@/components/auth/CardWrapper";
import LoadingSpinner from "@/components/share/LoadingSpinner";
import React from "react";

type Props = {};

const AdminRoutesLoading = (props: Props) => {
  return (
    <div className="pagewrapper shadow-2xl">
      <CardWrapper
        headerLabel="Fetching..."
        backButtonLabel="Back to home"
        backButtonHref="/"
      >
        <div className="flex items-center justify-center w-full">
          <LoadingSpinner className="w-24 h-24 text-primary dark:text-primary-foreground" />
        </div>
      </CardWrapper>
    </div>
  );
};

export default AdminRoutesLoading;
