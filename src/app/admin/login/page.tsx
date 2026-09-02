import { Logo } from "@/components/admin/Shell";
import { LoginForm } from "@/components/admin/LoginForm";
import { envAuthMode } from "@/lib/auth";

export const metadata = { title: "Войти" };

export default function LoginPage() {
  const envReady = Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      {/* Left — form */}
      <section className="flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-12">
            <Logo />
          </div>

          <h1 className="mb-2 text-3xl font-semibold tracking-tight">Вход</h1>
          <p className="mb-10 text-sm text-muted-foreground">
            Введите логин и&nbsp;пароль, чтобы попасть в&nbsp;панель управления сайтом.
          </p>

          <LoginForm />

          {envAuthMode && !envReady && (
            <p className="mt-8 rounded-md border border-warning/50 p-3 text-xs text-warning">
              База данных не&nbsp;подключена, а&nbsp;ADMIN_USERNAME / ADMIN_PASSWORD не&nbsp;заданы. Добавьте их
              в&nbsp;<code>.env.local</code> (см.&nbsp;<code>.env.example</code>) и&nbsp;перезапустите сервер.
            </p>
          )}
        </div>
      </section>

      {/* Right — brand panel (hidden on mobile) */}
      <aside className="relative hidden bg-muted/40 lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">Управляйте контентом сайта</h2>
            <p className="text-sm text-muted-foreground">
              Тексты, фотографии, отзывы, FAQ, города и&nbsp;лендинги - всё редактируется здесь и&nbsp;публикуется
              на&nbsp;сайт.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
