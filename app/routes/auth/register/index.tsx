import { useNavigate, useLocation } from "react-router";
import { RegisterForm } from "@/routes/auth/register/_components/register-form";
import Logo from "@/routes/_components/logo";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search, {
        replace: true,
      });
    } else {
      navigate("/history", { replace: true });
    }
  };

  const isModal = !!location.state?.backgroundLocation;

  if (isModal) {
    return <RegisterForm onSuccess={handleSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(#cef739_0.5px,transparent_0.5px)] bg-size-[16px_16px] opacity-5 pointer-events-none" />
      <div className="w-full max-w-md space-y-8 z-10 flex flex-col items-center">
        <Logo />
        <Card className="w-full border border-border/80 rounded-3xl bg-card/50 backdrop-blur-md shadow-xl p-6">
          <CardContent className="p-0">
            <RegisterForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
