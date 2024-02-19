import CardWrapper from "@/components/auth/CardWrapper";
import { headers } from "next/headers";
import React from "react";

type Props = {};

const VerifyRequestPage = (props: Props) => {
  const headersList = headers();
  const domain = headersList.get("host") || "";

  return (
    <div className="pagewrapper">
      <CardWrapper
        headerLabel="Check your email"
        backButtonHref="/"
        backButtonLabel={domain}
      >
        <p className="text-center">A sign in link has been sent to</p>
        <p className="text-center">your email address</p>
      </CardWrapper>
    </div>
  );
};

export default VerifyRequestPage;
