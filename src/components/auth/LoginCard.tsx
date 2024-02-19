import Separator from "../share/Separator";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

import BackButton from "./BackButton";
import CredentialsLoginForm from "./CredentialsLoginForm";
import EmailLoginForm from "./EmailLoginForm";
import Header from "./Header";
import Social from "./Social";

type Props = {};

const LoginCard = (props: Props) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={"Create an account"} />
      </CardHeader>
      <CardContent>
        <CredentialsLoginForm />
        <Separator className="mt-8">Or Email Login</Separator>
        <EmailLoginForm />
        <Separator className="mt-8 mb-4">Or Social Account Login</Separator>
        <Social />
      </CardContent>

      <CardFooter className="mt-4 flex flex-col">
        <BackButton label={"Do not have an account?"} href={"/auth/register"} />
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
