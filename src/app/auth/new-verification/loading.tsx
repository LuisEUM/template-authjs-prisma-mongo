import CardWrapper from "@/src/components/auth/CardWrapper";
import LoadingSpinner from "@/src/components/share/LoadingSpinner";
import React from "react";

type Props = {};

const NewVerificationPageLoading = (props: Props) => {
  return (
    <div className="pagewrapper shadow-2xl">
      <CardWrapper
        headerLabel="Confirm you verification"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
      >
        <div className="flex items-center justify-center w-full">
          <LoadingSpinner className="w-24 h-24 text-primary dark:text-primary-foreground" />
        </div>
      </CardWrapper>
    </div>
  );
};

export default NewVerificationPageLoading;
