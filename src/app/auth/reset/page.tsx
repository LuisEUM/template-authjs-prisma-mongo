import CardWrapper from "@/components/auth/CardWrapper";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import React from "react";

type Props = {};

const ResetPasswordPage = (props: Props) => {
  return (
    <div className="pagewrapper ">
      <CardWrapper
        headerLabel="Forgot your password"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
      >
        <ResetPasswordForm />
      </CardWrapper>
    </div>
  );
};

export default ResetPasswordPage;
